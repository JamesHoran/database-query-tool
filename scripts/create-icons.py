#!/usr/bin/env python3
"""Create simple PWA icons as PNG files."""

def create_png(size, filename):
    """Create a simple PNG with Python logo colors."""
    # PNG file signature
    png_signature = b'\x89PNG\r\n\x1a\n'

    # Simple 1x1 blue pixel that will be scaled
    # For a proper icon, we'd need more complex code
    # This creates a minimal valid PNG

    # IHDR chunk
    import struct
    width = height = size
    bit_depth = 8
    color_type = 2  # RGB
    compression = 0
    filter_method = 0
    interlace = 0

    ihdr = struct.pack('>IIBBBBB', width, height, bit_depth, color_type,
                        compression, filter_method, interlace)

    # Create IDAT chunk with simple image data
    import zlib
    import array

    # Create image data - all blue pixels
    row_data = b''
    for y in range(height):
        row_data += b'\x00'  # filter type
        for x in range(width):
            row_data += b'\x3b\x82\xf6'  # blue color #3b82f6

    idat_data = zlib.compress(row_data, 9)

    # Create chunks
    def create_chunk(chunk_type, data):
        import struct
        crc = zlib.crc32(chunk_type + data) & 0xffffffff
        return struct.pack('>I', len(data)) + chunk_type + data + struct.pack('>I', crc)

    chunks = []
    chunks.append(create_chunk(b'IHDR', ihdr))
    chunks.append(create_chunk(b'IDAT', idat_data))
    chunks.append(create_chunk(b'IEND', b''))

    # Write PNG file
    with open(filename, 'wb') as f:
        f.write(png_signature)
        f.write(b''.join(chunks))

    print(f'Created {filename}')

if __name__ == '__main__':
    for size in [192, 512]:
        create_png(size, f'/home/coder/database-query-tool/public/icon-{size}.png')
