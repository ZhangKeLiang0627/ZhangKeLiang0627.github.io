---
title: 对任意文件进行签名加密验证的小utils
excerpt: 嘘...勉强能用balabala...
tags: [Linux]
index_img: /images/对任意文件进行签名加密验证的小utils/image-0.jpg
banner_img: /images/对任意文件进行签名加密验证的小utils/image-1.jpg

categories: Study Page
comment: 'twikoo'
date: 2026-2-19 16:59:00

password: password
---

### 对任意文件进行签名加密验证的小utils
### Author：@kkl

{% note warning %}

本文等待施工啊🧑‍🌾🧑‍🌾!

{% endnote %}


{% note success %}

最近在补番鬼灭啊，一口气看完了所有的剧场，才发现动画居然还没有出完，失策啊！意犹未尽，遂贴上各种梗图，自我安慰...!

**——from 2026.2.19**
{% endnote %}

<figure>
<img src="/images/对任意文件进行签名加密验证的小utils/image-1.jpg" alt="" width = "600" height = "400" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

{% note info %}

好哇，我终于有个时间来先起个头了。最近也是开工小吉了（开工消极啊/_ \

立刻从悠闲家里宅的假期回到紧张的工作当中，难免有些力不从心。我是大年初八上班，俗话说的好：年初八就上班的牛马，干什么都会成功的！
去年和圆还是住校当实习生的时候，我们俩也是双双过完年初八就赶回来上班，年初八就上班的实习生啊，干什么都会非常优秀的啊（笑...

说远了，这次要更新的内容可能跨度稍微有点大哈，涉及到加密签名的领域。起因是我想要了解一下OTA，发现现在OTA的方式还是百花齐放的，主流的有AB分区等方式，那种镜像本身就是二进制文件，用不上做加密；**而另外一种更新就是单纯对需要更新的文件进行替换，这个时候通过OTA拉取升级包的时候，如果不做加密，就会存在数据、架构泄露的风险，倘若不做签名，就会有升级包被篡改的可能。总之是非常的不安全！**

因此，针对这种更新文件的OTA方式，急需一个可以对任意文件进行加密签名验证的utils来提升包在传输中的安全性！

**——from 2026.2.27**
{% endnote %}


---

## 写在前面

当前已开发实现文件加密签名工具**Signer**(_Ed25519 + AES-256-GCM + SHA-256_).

> 先来简单讲一下制作工具用上的这几个模块（专注用法，不讲原理：

### Ed25519
一种签名验证算法... 

### AES-256-GCM
一种加密算法...

### SHA-256
一种不可逆的哈希...

## 开始

{% fold info @Signer %}

```python
#!/usr/bin/env python3
"""固件签名与加密工具（Ed25519 + AES-256-GCM + SHA-256哈希）

功能：
1. 生成Ed25519密钥对 + AES加密密钥（Base64格式打印）
2. 对原始文件加密+哈希+签名，生成xxx.xxx.sig加密签名包
3. 验证sig包的签名+哈希+解密，还原原始文件
4. 打印已配置密钥的16进制格式（Ed25519私钥/公钥 + AES密钥）

使用方法：
# 1. 生成密钥（Base64格式打印，复制到代码变量中）
python3 signer.py --generate-keys

# 2. 填写密钥（将步骤1的Base64值填入代码中对应变量）
# ED25519_PRIVATE_KEY_BASE64 = "生成的Ed25519私钥Base64"
# ED25519_PUBLIC_KEY_BASE64 = "生成的Ed25519公钥Base64"
# AES_KEY_BASE64 = "生成的AES密钥Base64"

# 3. 加密+签名
python3 signer.py --sign [原始文件路径]
示例：python3 signer.py --sign firmware.img

# 4. 验证+解密
python3 signer.py --verify [.sig路径] [解密后文件输出路径]
示例：python3 signer.py --verify firmware.img.sig restored.img

# 5. 打印密钥16进制格式（需先填写Base64变量）
python3 signer.py --print-hex
"""

import os
import sys
import base64
import logging
from typing import Tuple
from argparse import ArgumentParser
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.backends import default_backend
import secrets

# -------------------------- 用户需填写的密钥（Base64格式）--------------------------
# 请将--generate-keys生成的对应Base64值填入下方引号中
ED25519_PRIVATE_KEY_BASE64 = ""
ED25519_PUBLIC_KEY_BASE64 = ""
AES_KEY_BASE64 = ""
# ----------------------------------------------------------------------------------

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger(__name__)

# 常量定义（固定长度，用于拆分sig包）
ED25519_SIGNATURE_LEN = 64  # Ed25519签名长度
AES_IV_LEN = 12             # AES-GCM推荐IV长度（12字节，安全性最高）
AES_TAG_LEN = 16            # AES-GCM认证标签长度（16字节）
AES_KEY_LEN = 32            # AES-256密钥长度（32字节）
SHA256_HASH_LEN = 32        # SHA-256哈希值长度（32字节）

# xxx.xxx.sig包结构
# [签名(64字节)] + [SHA256哈希值(32字节)] + [AES-IV(12字节)] + [AES-Tag(16字节)] + [明文加密后的密文数据(任意长度)]
SIG_PACKAGE_HEADER_LEN = ED25519_SIGNATURE_LEN + SHA256_HASH_LEN + AES_IV_LEN + AES_TAG_LEN

# ---------- 通用工具函数 ----------
def base64_to_bytes(base64_str: str) -> bytes:
    """Base64字符串转字节流（含异常处理）"""
    try:
        return base64.b64decode(base64_str.strip())
    except Exception as e:
        logger.error(f"Base64解码失败：{str(e)}")
        sys.exit(1)

def bytes_to_hex(bytes_data: bytes) -> str:
    """字节流转16进制字符串（大写，无空格，便于复制）"""
    return bytes_data.hex().upper()

# ---------- 密钥16进制转换函数 ----------
def ed25519_priv_to_hex(base64_str: str) -> str:
    """Ed25519私钥（Base64格式）转16进制格式"""
    priv_bytes = base64_to_bytes(base64_str)
    # 验证私钥格式合法性
    try:
        ed25519.Ed25519PrivateKey.from_private_bytes(priv_bytes)
    except Exception as e:
        logger.error(f"Ed25519私钥格式错误：{str(e)}")
        sys.exit(1)
    return bytes_to_hex(priv_bytes)

def ed25519_pub_to_hex(base64_str: str) -> str:
    """Ed25519公钥（Base64格式）转16进制格式"""
    pub_bytes = base64_to_bytes(base64_str)
    # 验证公钥格式合法性
    try:
        ed25519.Ed25519PublicKey.from_public_bytes(pub_bytes)
    except Exception as e:
        logger.error(f"Ed25519公钥格式错误：{str(e)}")
        sys.exit(1)
    return bytes_to_hex(pub_bytes)

def aes_key_to_hex(base64_str: str) -> str:
    """AES密钥（Base64格式）转16进制格式"""
    aes_bytes = base64_to_bytes(base64_str)
    # 验证AES密钥长度
    if len(aes_bytes) != AES_KEY_LEN:
        logger.error(f"AES密钥长度错误（需{AES_KEY_LEN}字节，实际{len(aes_bytes)}字节）")
        sys.exit(1)
    return bytes_to_hex(aes_bytes)

# ---------- 密钥生成函数 ----------
def generate_all_keys() -> None:
    """生成全套密钥：Ed25519密钥对 + AES-256密钥（Base64格式打印）"""
    # 1. 生成Ed25519密钥对
    logger.info("生成Ed25519签名密钥对...")
    ed25519_private_key = ed25519.Ed25519PrivateKey.generate()
    ed25519_public_key = ed25519_private_key.public_key()
    
    # 转Base64格式
    ed25519_priv_base64 = base64.b64encode(ed25519_private_key.private_bytes_raw()).decode("utf-8")
    ed25519_pub_base64 = base64.b64encode(ed25519_public_key.public_bytes_raw()).decode("utf-8")
    
    # 2. 生成AES-256密钥
    logger.info("生成AES-256加密密钥...")
    aes_key = secrets.token_bytes(AES_KEY_LEN)
    aes_key_base64 = base64.b64encode(aes_key).decode("utf-8")
    
    # 格式化打印（便于复制）
    logger.info("="*80)
    logger.info("✅ 密钥生成完成！请复制以下值填入代码中的对应变量：")
    logger.info("-"*80)
    logger.info(f'ED25519_PRIVATE_KEY_BASE64 = "{ed25519_priv_base64}"')
    logger.info(f'ED25519_PUBLIC_KEY_BASE64 = "{ed25519_pub_base64}"')
    logger.info(f'AES_KEY_BASE64 = "{aes_key_base64}"')
    logger.info("-"*80)
    logger.info("📌 密钥预览（16进制格式）：")
    logger.info(f"Ed25519私钥：{ed25519_priv_to_hex(ed25519_priv_base64)}")
    logger.info(f"Ed25519公钥：{ed25519_pub_to_hex(ed25519_pub_base64)}")
    logger.info(f"AES密钥：{aes_key_to_hex(aes_key_base64)}")
    logger.info("="*80)

# ---------- AES-256-GCM 加密与解密 ----------
def aes_encrypt(data: bytes, aes_key: bytes) -> Tuple[bytes, bytes, bytes]:
    """AES-256-GCM加密：返回（加密后数据, IV, 认证标签）"""
    iv = secrets.token_bytes(AES_IV_LEN)
    cipher = Cipher(algorithms.AES(aes_key), modes.GCM(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(data) + encryptor.finalize()
    return ciphertext, iv, encryptor.tag

def aes_decrypt(ciphertext: bytes, iv: bytes, tag: bytes, aes_key: bytes) -> bytes:
    """AES-256-GCM解密：输入（加密数据, IV, 认证标签），返回原始数据"""
    cipher = Cipher(algorithms.AES(aes_key), modes.GCM(iv, tag), backend=default_backend())
    decryptor = cipher.decryptor()
    return decryptor.update(ciphertext) + decryptor.finalize()

# ---------- Ed25519 签名与验证 ----------
def calculate_sha256(data: bytes) -> bytes:
    """计算数据的SHA-256哈希值（固定32字节）"""
    hash_ctx = hashes.Hash(hashes.SHA256(), backend=default_backend())
    hash_ctx.update(data)
    return hash_ctx.finalize()

def sign_and_encrypt_firmware(img_path: str) -> None:
    """对原始文件执行：AES加密 → 哈希 → 签名 → 生成sig包"""
    # 校验密钥是否填写
    if not ED25519_PRIVATE_KEY_BASE64 or not AES_KEY_BASE64:
        logger.error("❌ 请先在代码中填写ED25519_PRIVATE_KEY_BASE64和AES_KEY_BASE64")
        sys.exit(1)
    
    # 校验原始文件
    if not os.path.exists(img_path):
        logger.error(f"❌ 原始文件不存在：{img_path}")
        sys.exit(1)
    
    # 读取原始数据
    with open(img_path, "rb") as f:
        img_data = f.read()
    logger.info(f"读取原始文件：{img_path}（大小：{len(img_data)}字节）")
    
    # 加载AES密钥
    aes_key = base64_to_bytes(AES_KEY_BASE64)
    logger.info("AES-256密钥加载成功")
    
    # AES加密
    ciphertext, iv, tag = aes_encrypt(img_data, aes_key)
    logger.info(f"AES加密完成（密文大小：{len(ciphertext)}字节）")
    
    # 计算密文哈希
    ciphertext_hash = calculate_sha256(ciphertext)
    logger.info("SHA-256哈希计算完成")
    
    # 加载Ed25519私钥并签名
    try:
        ed25519_priv_bytes = base64_to_bytes(ED25519_PRIVATE_KEY_BASE64)
        ed25519_private_key = ed25519.Ed25519PrivateKey.from_private_bytes(ed25519_priv_bytes)
        signature = ed25519_private_key.sign(ciphertext_hash)
    except Exception as e:
        logger.error(f"❌ Ed25519签名失败：{str(e)}")
        sys.exit(1)
    logger.info("Ed25519签名完成")
    
    # 生成sig包
    sig_path = f"{img_path}.sig"
    with open(sig_path, "wb") as f:
        f.write(signature)
        f.write(ciphertext_hash)
        f.write(iv)
        f.write(tag)
        f.write(ciphertext)
    logger.info(f"✅ 加密签名包生成完成：{sig_path}（大小：{os.path.getsize(sig_path)}字节）")

def verify_and_decrypt_firmware(sig_path: str, output_img_path: str) -> bool:
    """对sig包执行：拆分 → 签名验证 → 哈希校验 → 解密 → 输出原始文件"""
    # 校验密钥是否填写
    if not ED25519_PUBLIC_KEY_BASE64 or not AES_KEY_BASE64:
        logger.error("❌ 请先在代码中填写ED25519_PUBLIC_KEY_BASE64和AES_KEY_BASE64")
        return False
    
    # 校验sig包
    if not os.path.exists(sig_path):
        logger.error(f"❌ sig包不存在：{sig_path}")
        return False
    
    # 读取并拆分sig包
    sig_file_size = os.path.getsize(sig_path)
    if sig_file_size < SIG_PACKAGE_HEADER_LEN:
        logger.error(f"❌ sig包格式无效（过小，需至少{SIG_PACKAGE_HEADER_LEN}字节）")
        return False
    
    with open(sig_path, "rb") as f:
        signature = f.read(ED25519_SIGNATURE_LEN)
        saved_hash = f.read(SHA256_HASH_LEN)
        iv = f.read(AES_IV_LEN)
        tag = f.read(AES_TAG_LEN)
        ciphertext = f.read()
    logger.info("sig包拆分完成")
    
    # 计算密文哈希
    calculated_hash = calculate_sha256(ciphertext)
    logger.info("密文哈希值计算完成")
    
    # 验证签名
    try:
        ed25519_pub_bytes = base64_to_bytes(ED25519_PUBLIC_KEY_BASE64)
        ed25519_public_key = ed25519.Ed25519PublicKey.from_public_bytes(ed25519_pub_bytes)
        ed25519_public_key.verify(signature, saved_hash)
        logger.info("✅ 签名验证通过")
    except InvalidSignature:
        logger.error("❌ 签名验证失败（数据可能被篡改）")
        return False
    except Exception as e:
        logger.error(f"❌ 签名验证异常：{str(e)}")
        return False
    
    # 校验哈希值
    if calculated_hash != saved_hash:
        logger.error("❌ 哈希值校验失败（密文已篡改）")
        return False
    logger.info("✅ 哈希值校验通过")
    
    # AES解密
    try:
        aes_key = base64_to_bytes(AES_KEY_BASE64)
        img_data = aes_decrypt(ciphertext, iv, tag, aes_key)
    except Exception as e:
        logger.error(f"❌ AES解密失败：{str(e)}")
        return False
    logger.info(f"AES解密完成（原始数据大小：{len(img_data)}字节）")
    
    # 保存原始文件
    with open(output_img_path, "wb") as f:
        f.write(img_data)
    logger.info(f"✅ 原始文件已保存：{output_img_path}")
    return True

# ---------- 打印密钥16进制格式函数 ----------
def print_all_keys_hex() -> None:
    """打印所有已配置密钥的16进制格式（需先填写Base64变量）"""
    # 校验密钥是否填写
    if not all([ED25519_PRIVATE_KEY_BASE64, ED25519_PUBLIC_KEY_BASE64, AES_KEY_BASE64]):
        logger.error("❌ 请先在代码中填写所有3个Base64密钥变量")
        sys.exit(1)
    
    # 转换并打印
    logger.info("="*80)
    logger.info("📋 已配置密钥的16进制格式：")
    logger.info("-"*80)
    # logger.info(f"Ed25519私钥：{ed25519_priv_to_hex(ED25519_PRIVATE_KEY_BASE64)}")
    logger.info(f"Ed25519公钥：{ed25519_pub_to_hex(ED25519_PUBLIC_KEY_BASE64)}")
    logger.info(f"AES-256密钥：{aes_key_to_hex(AES_KEY_BASE64)}")
    logger.info("="*80)

# ---------- 参数解析函数 ----------
def parse_arguments() -> ArgumentParser:
    """解析命令行参数"""
    parser = ArgumentParser(description="Firmware Signer & Encryptor (Ed25519 + AES-256-GCM + SHA-256)")
    
    # 互斥参数组：必须选择一个操作
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "--generate-keys",
        action="store_true",
        help="Generate full keys (Ed25519 + AES-256) → print Base64 format"
    )
    group.add_argument(
        "--sign",
        nargs=1,
        metavar=("IMG_PATH"),
        help="Sign + Encrypt firmware (use configured Base64 keys) → e.g., --sign firmware.img"
    )
    group.add_argument(
        "--verify",
        nargs=2,
        metavar=("SIG_PATH", "OUTPUT_IMG_PATH"),
        help="Verify + Decrypt firmware (use configured Base64 keys) → e.g., --verify firmware.img.sig restored.img"
    )
    group.add_argument(
        "--print-hex",
        action="store_true",
        help="Print configured keys in HEX format (require Base64 keys filled first)"
    )
    
    return parser.parse_args()

# ---------- 主函数 ----------
if __name__ == "__main__":
    args = parse_arguments()
    
    try:
        if args.generate_keys:
            generate_all_keys()
        elif args.sign:
            img_path = args.sign[0]
            sign_and_encrypt_firmware(img_path)
        elif args.verify:
            sig_path, output_img_path = args.verify
            verify_result = verify_and_decrypt_firmware(sig_path, output_img_path)
            sys.exit(0 if verify_result else 1)
        elif args.print_hex:
            print_all_keys_hex()
    except Exception as e:
        logger.error(f"❌ 工具执行失败：{str(e)}", exc_info=True)
        sys.exit(1)
```

{% endfold %}


## 写在后面
~虽然，今天是假期，所以因为是假期需要休息，合情合理，今日只想要大睡特睡，有空会更新（这坑大，睡下怕一趴不起啦ahh~

优化方向，密钥在嵌入式设备端将以硬编码的方式编译成二进制文件，可能存在被反编译的风险，所以可对密钥采取**凯撒密码**进一步加密...


<!-- ### 鸣谢 -->

