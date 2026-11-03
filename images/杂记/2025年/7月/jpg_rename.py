import os
import re
from pathlib import Path

def get_existing_numbers(directory):
    """获取目录中已存在的 image-x.jpg 格式文件的数字部分"""
    existing_numbers = set()
    for filename in os.listdir(directory):
        match = re.match(r'image-(\d+)\.jpg', filename, re.IGNORECASE)
        if match:
            existing_numbers.add(int(match.group(1)))
    return existing_numbers

def find_next_available_number(existing_numbers):
    """找到下一个可用的数字"""
    x = 0
    while x in existing_numbers:
        x += 1
    return x

def rename_jpg_files(directory):
    """将目录下的所有 JPG 文件按顺序重命名为 image-x.jpg"""
    # 获取目录中已存在的数字
    existing_numbers = get_existing_numbers(directory)
    
    # 获取所有 JPG 文件并按修改时间排序
    jpg_files = sorted(
        [f for f in os.listdir(directory) if f.lower().endswith('.jpg')],
        key=lambda f: os.path.getmtime(os.path.join(directory, f))
    )
    
    # 处理每个 JPG 文件
    for filename in jpg_files:
        old_path = os.path.join(directory, filename)
        
        # 找到下一个可用的数字
        x = find_next_available_number(existing_numbers)
        new_filename = f'image-{x}.jpg'
        new_path = os.path.join(directory, new_filename)
        
        # 重命名文件
        os.rename(old_path, new_path)
        print(f"已重命名: {filename} -> {new_filename}")
        
        # 更新已存在的数字集合
        existing_numbers.add(x)

if __name__ == "__main__":
    # 获取脚本所在目录
    script_directory = Path(__file__).parent.resolve()
    
    # 执行重命名操作
    rename_jpg_files(script_directory)
    print("所有 JPG 文件重命名完成!")