import os
from PIL import Image

output_dir = "webp"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

images = [
    "20231028hikarino5.jpg",
    "20231028hikarino9.jpg",
    "20231028Hikarino4.jpg",
    "20231028hikarino10.jpg",
    "20231028_Hikarino3.jpg",
    "20231028hikarinot1.jpg",
    "221108_Hikarinot2.JPG",
    "221108_Hikarinot3.JPG",
    "topvoice_pc.png",
    "suiall_pc.png",
    "incho.jpg",
    "amazon.jpg"
]

max_width = 1200

for filename in images:
    if os.path.exists(filename):
        try:
            with Image.open(filename) as img:
                # Resize if needed
                if img.width > max_width:
                    new_height = int((max_width / img.width) * img.height)
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                
                # Convert to RGB if needed (PNG might have Alpha)
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                
                # Save as WebP
                basename = os.path.splitext(filename)[0]
                output_path = f"{basename}.webp"
                img.save(output_path, "WEBP", quality=80)
                print(f"Compressed {filename} to {output_path} ({os.path.getsize(output_path)} bytes)")
        except Exception as e:
            print(f"Failed to process {filename}: {e}")
    else:
        print(f"File not found: {filename}")
