---
author:
  - Azaki
source: https://hackmd.io/@azaki/H1rd-W0lbg
published: published
created: 2025-11-22
description:
title:
---

# Net 1

Chúng tôi phát hiện bất thường trong lưu lượng Modbus TCP/IP của hệ thống điều khiển; một số thanh ghi có vài dữ lieu bất thường. Hãy giúp tôi điều tra và phân tích file để tìm ra nguyên nhân gốc.


Đầu tiên tìm kiếm sơ bộ thì mình chẳng thấy thấy có text ẩn hay chuỗi bị encode nào rõ ràng được giấu cả vì các gói tin  chứa rât ít thông tin vì thế mình tập chung tìm kiếm theo mô tả là Modbus lúc đầu thì mình không thấy gì hữu ít cả nhưng sau đó mình thấy có sữ thay đổi nhở ở các gói tin là phần "Data" có 2 giá trị là "ff00" và "0000" nghe có mùi của nhị phân

![[Pasted image 20260415040547.png]]
![[Pasted image 20260415040550.png]]

Vì thế mình dùng Scapy để giải bài này với ý tưởng như sau
Lọc trong bus.pcap các gói Modbus ra
Sau đó tại phần Data: "ff00" = 1 và "0000" = 0 sau đó ghép lại thành chuỗi và decode

```python
from scapy.all import rdpcap, TCP, IP

PCAP_FILE = "bus.pcap"   

def bits_to_ascii(bit_str):
    bit_str = bit_str[: len(bit_str) // 8 * 8]  # cắt cho đủ bội số 8
    b = bytes(int(bit_str[i:i+8], 2) for i in range(0, len(bit_str), 8))
    return b.decode("ascii", errors="replace")


def extract_bits_from_modbus_fc5(pcap_path):
    pkts = rdpcap(pcap_path)
    bits = []

    for pkt in pkts:
        # Chỉ xử lý gói TCP tới port 502
        if not pkt.haslayer(TCP) or not pkt.haslayer(IP):
            continue
        tcp = pkt[TCP]
        if tcp.dport != 502:
            continue

        payload = bytes(tcp.payload)
        if len(payload) < 12:
            continue

        proto_id = int.from_bytes(payload[2:4], "big")
        if proto_id != 0:
            continue

        unit_id = payload[6]
        fc = payload[7]
        if fc != 5:  
            continue

        if len(payload) < 12:
            continue

        addr = int.from_bytes(payload[8:10], "big")
        val = int.from_bytes(payload[10:12], "big")

        if addr != 0:
            continue

        if val == 0xFF00:
            bits.append('1')
        elif val == 0x0000:
            bits.append('0')
    

    return ''.join(bits)


if __name__ == "__main__":
    bit_string = extract_bits_from_modbus_fc5(PCAP_FILE)
    print("So bit thu duoc:", len(bit_string))
    message = bits_to_ascii(bit_string)
    print("Chuoi giai ma duoc:")
    print(message)
```


![[Pasted image 20260415040601.png]]

>Flag: Modbus_is_easy_after_all!


---

# Net 2

Hệ thống ghi nhận hoạt động bất thường từ thiết bị USB HID được cắm vào máy trạm, nghi ngờ là thiết bị giả mạo (như Rubber Ducky) thực thi chuỗi lệnh tự động. Yêu cầu phân tích dữ liệu thu thập được để xác định hành vi, mã lệnh thực thi và trích xuất flag liên quan.


Ý tưởng như sau
Chỉ lấy các gói có HID report và lấy 8 byte HID cuối gói tin

![[Pasted image 20260415040606.png]]

Sau đó dựa trên bảng USB HID Usage ID để biết được ký tự đã được gõ rồi ghép lại thành chuỗi
```text
0x04 – 0x1d: a–z
0x1e – 0x27: 1–0
0x2d: - / _ (Shift + -)
0x2f: [ / { (Shift + [)
0x30: ] / } (Shift + ])
0x28: Enter
```
 
```python
from scapy.all import rdpcap, Raw

hid_normal = {
    # a-z
    **{code: chr(ord('a') + code - 0x04) for code in range(0x04, 0x1e)},
    # 1-0
    0x1e: '1',
    0x1f: '2',
    0x20: '3',
    0x21: '4',
    0x22: '5',
    0x23: '6',
    0x24: '7',
    0x25: '8',
    0x26: '9',
    0x27: '0',
    0x28: '\n',   # Enter
    0x2c: ' ',    # Space
    0x2d: '-',    # - _
    0x2e: '=',
    0x2f: '[',    # [ {
    0x30: ']',    # ] }
    0x31: '\\',
    0x33: ';',
    0x34: '\'',
    0x35: '`',
    0x36: ',',
    0x37: '.',
    0x38: '/',
}

# Map cho có Shift (Left/Right Shift)
hid_shift = {
    # A-Z
    **{code: chr(ord('A') + code - 0x04) for code in range(0x04, 0x1e)},
    # !@#$%^&*()
    0x1e: '!',
    0x1f: '@',
    0x20: '#',
    0x21: '$',
    0x22: '%',
    0x23: '^',
    0x24: '&',
    0x25: '*',
    0x26: '(',
    0x27: ')',
    0x28: '\n',   # Enter (Shift không đổi)
    0x2c: ' ',    # Space (Shift không đổi)
    0x2d: '_',
    0x2e: '+',
    0x2f: '{',
    0x30: '}',
    0x31: '|',
    0x33: ':',
    0x34: '"',
    0x35: '~',
    0x36: '<',
    0x37: '>',
    0x38: '?',
}


def decode_usb_hid_pcap(pcap_file):
    pkts = rdpcap(pcap_file)

    result = []
    last_report = None

    for pkt in pkts:
        if Raw not in pkt:
            continue

        data = bytes(pkt[Raw])

        if len(data) < 8:
            continue

        report = data[-8:]
        modifier = report[0]
        keycode = report[2]

        if report == last_report or keycode == 0:
            last_report = report
            continue

        last_report = report

        shift = bool(modifier & 0x22)  # 0x02 | 0x20

        table = hid_shift if shift else hid_normal
        ch = table.get(keycode, '')

        if ch:
            result.append(ch)

    return ''.join(result)


if __name__ == "__main__":
    pcap_path = "USB.pcap"  

    text = decode_usb_hid_pcap(pcap_path)
    print("Decoded text:")
    print(repr(text)) 
```

![image](https://hackmd.io/_uploads/ByrXqD1bWx.png)

>Flag: KCSC{I_love_you}

# Net 3

Hệ thống ghi nhận lưu lượng bất thường đặc trưng TCP SYN flood (tăng đột biến gói SYN, nhiều kết nối half-open) gây suy giảm dịch vụ và hết hàng đợi TCP. Hãy giúp tôi tìm ra root cause và trích xuất các dữ liệu liên quan để đưa ra các biện pháp khắc phục tạm thời.


Xem sơ qua các gói tin thì mình tháy một số gói có text nằm ở cuối gói tin

![[Pasted image 20260415040745.png]]

Mình filter và thêm cột TCP Payload để dẽ nhìn

![[Pasted image 20260415040645.png]]

Mình dùng tshark để xuất đoạn hex ở cột TCP Payload ra và decode nó để lấy thông điệp

![[Pasted image 20260415040650.png]]


```text
A SYN flood is a type of network or cyber attack that targets the three-way handshake process used in establishing a connection between a client and a server in the Transmission Control Protocol (TCP). TCP is a fundamental protocol in computer networking that ensures reliable and ordered delivery of data between devices.

Here's how the TCP three-way handshake normally works:
SYN (Synchronize): The client sends a SYN packet to the server to initiate a connection request.
SYN-ACK (Synchronize-Acknowledge): The server responds with a SYN-ACK packet, indicating that it has received the request and is willing to establish a connection.
ACK (Acknowledge): The client sends an ACK packet to confirm the connection, and the connection is established.
In a SYN flood attack, the attacker sends a large number of SYN packets to the target server, but either does not respond to the server's SYN-ACK or sends S0NTQ3tTWU5fRmwwb2RfMVNfdDBPX2Rhbmdlcm91c30= malformed or false information. This overwhelms the server's ability to process and respond to legitimate connection requests, as the server must keep track of each incoming connection attempt until it is completed or times out.

The goal of a SYN flood attack is to consume the server's resources, such as memory and processing power, and ultimately to make the server unable to handle legitimate connection requests. This can lead to a denial-of-service (DoS) or distributed denial-of-service (DDoS) situation, where the targeted system becomes inaccessible or slow to respond to legitimate users.

To defend against SYN flood attacks, various mitigation techniques and technologies, such as firewalls, intrusion prevention systems (IPS), and rate limiting, can be employed to filter and control incoming traffic.
```

Và trong thông điệp mình tìm thấy có đoạn base64 nên decode nó

![[Pasted image 20260415040734.png]]

>Flag: KCSC{SYN_Fl0od_1S_t0O_dangerous}