author: Azaki
source: https://app.letsdefend.io/training/lessons/network-fundamentals
published: archived
created: 2026-04-02
description: Mỗi chuyên viên phân tích SOC cần hiểu cách thức hoạt động của mạng. Với kiến ​​thức cơ bản vững chắc này, các vấn đề kỹ thuật khác sẽ dễ hiểu hơn.
tags: Theory, Network

---
# Giới thiệu về các nguyên lý cơ bản của mạng máy tính

## Mạng máy tính là gì?

Con người và các thiết bị kỹ thuật số là những thực thể giao tiếp với nhau. Cũng giống như con người có một vòng tròn, các thiết bị trong thế giới kỹ thuật số cũng có một vòng tròn.

![[net.png]]

Môi trường được tạo ra bởi các thiết bị trong thế giới kỹ thuật số được gọi là "Mạng máy tính". Nói cách khác, cấu trúc trong đó ít nhất hai thiết bị giao tiếp với nhau có thể được gọi là "Mạng máy tính".

![[net1.png]]

## Mục đích của mạng máy tính

Nhờ sự phát triển của công nghệ, mạng máy tính đã trở nên hữu dụng cho nhiều mục đích khác nhau. Các ứng dụng chính của mạng máy tính như sau:  
  - Cung cấp tính năng truyền tải hình ảnh và âm thanh (Trò chuyện và họp trực tuyến)
  - Chia sẻ phần cứng (Chia sẻ máy in)
  - Chia sẻ tập tin, dữ liệu và thông tin
  - Chia sẻ phần mềm
  - Quản lý trung ương
  - Ủng hộ

---

# Các loại mạng

Mạng máy tính được phân chia theo địa lý thành nhiều nhóm dựa trên quy mô của chúng. Có thể có những mạng lớn với hàng triệu thiết bị và những mạng nhỏ chỉ gồm 2-3 thiết bị. Hình ảnh sau đây minh họa một số loại mạng máy tính theo quy mô.

![[net2.png]]

## Mạng khu vực cá nhân (PAN)

Mạng cá nhân (PAN) đề cập đến các mạng có số lượng thiết bị tối thiểu và nhỏ, phạm vi phủ sóng rất ngắn (ví dụ: tối đa 10 mét). Ví dụ, một thiết bị di động và một tai nghe không dây được kết nối qua Bluetooth là những ví dụ về loại mạng này. Chỉ có 2 thiết bị trong mạng nhỏ này: một thiết bị di động và một tai nghe không dây.

![[net3.png]]

## Mạng cục bộ (LAN)

Mạng cục bộ (LAN) có phạm vi phủ sóng lớn hơn mạng toàn cục (PAN). Số lượng thiết bị trong đó có thể nhiều hơn đáng kể. Đây là loại mạng được sử dụng và tìm thấy phổ biến nhất. Đôi khi, một mạng chỉ có 2 thiết bị cũng có thể được gọi là LAN. Việc nó hỗ trợ nhiều hơn 2 thiết bị về mặt dung lượng và được phân bố rộng hơn về mặt địa lý cho thấy đó là mạng kiểu LAN. Ví dụ, mạng gia đình và mạng chia sẻ trong tòa nhà có thể được đưa ra làm ví dụ về mạng LAN.

![[net4.png]]

## Mạng lưới khu vực đô thị (MAN)

Mạng khu vực đô thị (MAN) là một mạng máy tính có quy mô địa lý tương đương một thành phố, trong đó nhiều mạng máy tính LAN được kết nối với nhau. Nó kết nối các mạng bằng cáp quang.

![[net5.png]]

## Mạng diện rộng (WAN)

Mạng diện rộng (WAN) là mạng máy tính có phạm vi địa lý lớn nhất trong số các mạng máy tính. Mạng máy tính này lớn đến mức thậm chí có thể bao trùm cả các châu lục. Nó chứa tất cả các mạng máy tính khác bên trong nó. Một ví dụ về mạng máy tính này là "Internet". Địa chỉ sau có thể được sử dụng để xem cơ sở hạ tầng cáp quang xuyên lục địa trên toàn thế giới:  
  
**Bản đồ cáp ngầm:** [submarinecablemap.com](https://submarinecablemap.com)

![[net6.png]]

## Mạng lưới khu vực khuôn viên trường (CAN)

Mạng khu vực khuôn viên trường (CAN) là một mạng máy tính có phạm vi địa lý nhỏ hơn mạng MAN và lớn hơn mạng LAN. Mạng máy tính này có thể chứa nhiều mạng LAN. Thông thường, mạng máy tính của các trường đại học, viện nghiên cứu hoặc các công ty tư nhân được đưa ra làm ví dụ về mạng máy tính này.

![[net7.png]]

---

# Cấu trúc mạng

Sơ đồ cấu trúc mạng là một bản đồ trực quan để hiểu cấu trúc vật lý hoặc logic của một mạng máy tính. Vị trí của các thiết bị và cáp trong mạng là một trong những yếu tố xác định sơ đồ cấu trúc mạng. Có nhiều lợi ích khi có sơ đồ cấu trúc mạng. Ví dụ, có thể thấy thiết bị nào khác trong mạng sẽ bị ảnh hưởng nếu một thiết bị trên mạng không thực hiện được nhiệm vụ của nó. Nếu chúng ta xem xét sơ đồ cấu trúc mạng của một mạng lớn, chúng ta có thể thấy các mạng con trong mạng và các thiết bị được kết nối với chúng. Sơ  
đồ cấu trúc mạng được chia thành 2 loại:  
  
**Cấu trúc vật lý:**  
  
Đây là loại cấu trúc trong đó tất cả các thiết bị và thành phần trong mạng được vẽ theo vị trí chính xác của chúng. Nhìn vào cấu trúc này, người ta có thể thấy cáp nào được tạo trên đường dẫn và thiết bị nào. Những gì được thấy trong bản vẽ có một đối tượng vật lý tương ứng. Ví dụ, nếu có một thiết bị mạng trên đường dẫn từ thiết bị A đến thiết bị B, thiết bị này được thể hiện trong cấu trúc vật lý.  
  
**Cấu trúc logic:**  
  
Nó không hiển thị vị trí chính xác của các thiết bị trong cấu trúc như cấu trúc vật lý. Nó thường chứa ít phần tử hơn so với cấu trúc liên kết vật lý. Bởi vì luồng dữ liệu rất quan trọng trong cấu trúc liên kết logic. Ví dụ, dữ liệu đi từ thiết bị A đến thiết bị B có thể không được bao gồm trong cấu trúc liên kết nếu nó đi qua thiết bị C giữa thiết bị A và thiết bị B, và thiết bị C không ảnh hưởng đến dữ liệu cần được hiển thị trên đó. Trong cấu trúc liên kết này, người ta muốn nhấn mạnh vào đường dẫn của luồng dữ liệu hơn là vị trí vật lý của các thiết bị.  
Một số cấu trúc liên kết được mô tả trong các chủ đề sau:  

## Cấu trúc vòng

Nó hoạt động theo logic vòng kín. Dữ liệu được gửi đi sẽ di chuyển xung quanh vòng tròn theo một chiều cho đến khi đến đích. Mỗi nút sẽ chuyển tiếp dữ liệu đến và đảm bảo rằng nó đến được đích. Không có mối quan hệ thứ bậc giữa các nút.

![[net8.png]]

![[net9.png]]

## Cấu trúc lưới

Đây là một cấu trúc mạng không có nút trung tâm và mỗi nút có thể được kết nối trực tiếp với các nút khác. Cấu trúc mạng dạng lưới không phù hợp với các mạng lớn. Nó được chia thành 2 loại:  

### Lưới toàn phần

Trong cấu trúc mạng Full-Mesh, mỗi nút trong mạng được kết nối với tất cả các nút khác bằng cáp riêng biệt. Trong cấu trúc mạng này, khả năng kết nối giữa hai nút bị gián đoạn là rất thấp, bởi vì có nhiều cách kết nối thay thế.

![[net9.gif]]
### Lưới một phần

Trong cấu trúc mạng Partial-Mesh, mặc dù mỗi nút không được kết nối trực tiếp với tất cả các nút khác, nhưng chúng vẫn được kết nối với nhau ở mức độ lớn. Giống như trong cấu trúc mạng Full-Mesh, vẫn có những cách khác để đến được nút đích trong trường hợp bị ngắt kết nối.!

![[net10.gif]]
## Cấu trúc mạng xe buýt

Cấu trúc liên kết dạng bus là một cấu trúc liên kết trong đó các nút được đặt trên một đường dẫn chung và việc truyền dữ liệu được thực hiện với kết nối hai chiều trên đường dẫn này. Trong cấu trúc liên kết dạng bus, mỗi nút đều nhận được mọi dữ liệu được truyền đi, ngay cả khi dữ liệu đó không thuộc về nó. Vì không có thứ bậc giữa các nút, nên không có ưu tiên truyền dữ liệu.

![[net11.gif]]

![[net12.png]]
## Cấu trúc liên kết điểm-đến-điểm

Cấu trúc liên kết điểm-điểm là cấu trúc liên kết đơn giản nhất và bao gồm hai nút được kết nối với nhau. Ví dụ, một cuộc gọi đi qua giữa hai điện thoại tạo ra cấu trúc liên kết điểm-điểm, hoặc một kết nối trực tiếp giữa hai máy tính tạo ra cấu trúc liên kết điểm-điểm.

![[net13.png]]

## Cấu trúc cây

Cấu trúc mạng dạng cây là một cấu trúc mạng lai được hình thành bằng cách kết nối cấu trúc mạng dạng sao và dạng bus. Cấu trúc mạng dạng cây có thứ bậc và mỗi nút có thể có bất kỳ số lượng nút con nào.

![[net14.gif]]

## Tổng kết

![[net15.png]]

- 1: Bus topology
- 2: Star topology
- 3: Ring topology
- 4: Mesh topology
- 5: Tree topology
- 6: Points-to-points topology
---

# Mô hình tham chiếu OSI

## Mô hình tham chiếu OSI là gì?

Mô hình tham chiếu Kết nối Hệ thống Mở (OSI) được Tổ chức Tiêu chuẩn hóa Quốc tế (ISO) phát triển vào năm 1978. Mô hình OSI được tạo ra để cho phép giao tiếp giữa các hệ điều hành khác nhau. Với mô hình này, việc hiểu cấu trúc mạng trở nên dễ dàng hơn. Nó là một mô hình tham chiếu chất lượng và có kiến ​​trúc phân lớp. Mỗi lớp trong mô hình OSI có các nhiệm vụ riêng biệt. Có một thứ tự phân cấp giữa các lớp này và mỗi lớp phục vụ lớp tiếp theo. Số lượng lớp trong mô hình OSI là 7.

![[net16.png]]

### 1. Lớp vật lý (Physical Layer)
Lớp vật lý là lớp đầu tiên trong mô hình OSI. Ở lớp này, dữ liệu được truyền theo từng bit dọc theo các kênh truyền thông. Vì lớp vật lý chỉ chịu trách nhiệm truyền dữ liệu, nên nó không có bất kỳ thông tin nào về loại dữ liệu mà nó truyền và dữ liệu đó là gì. Dữ liệu cho lớp này bao gồm các chuỗi bit được sắp xếp theo thứ tự.  

### 2. Lớp liên kết dữ liệu (Datalink layer)
Lớp liên kết dữ liệu là lớp thứ 2 trong mô hình OSI. Lớp này xử lý các bit từ lớp vật lý và chuẩn bị chúng để gửi đến lớp tiếp theo. Hoạt động cơ bản trong lớp này là định địa chỉ vật lý. Lớp đầu tiên chịu trách nhiệm kiểm tra lỗi trong mô hình tham chiếu OSI là "Lớp liên kết dữ liệu".  

### 3. Lớp mạng (Network Layer)
Lớp mạng là lớp thứ 3 trong mô hình OSI. Lớp mạng chịu trách nhiệm truyền dữ liệu đến địa chỉ logic đích (địa chỉ IP). Hoạt động cơ bản trong lớp này là gán địa chỉ logic.  

### 4. Lớp vận chuyển (Transport Layer)
Lớp vận chuyển là lớp thứ 4 trong mô hình OSI. Lớp vận chuyển chịu trách nhiệm về tính bảo mật của quá trình truyền dữ liệu. Lớp này cung cấp nhiều cơ chế kiểm soát bổ sung để đảm bảo truyền dữ liệu không bị lỗi và nhờ các cơ chế kiểm soát này, quá trình truyền dữ liệu được thực hiện thành công. 

### 5. Lớp phiên (Session Layer)
Lớp phiên là lớp thứ 5 trong mô hình OSI. Lớp phiên chịu trách nhiệm cung cấp các dịch vụ cần thiết để lớp trình bày hoạt động. Hoạt động chính trong lớp này là quản lý phiên.  

### 6. Lớp trình bày (Presentation layer)
Lớp trình bày là lớp thứ 6 trong mô hình OSI. Lớp trình bày là lớp nơi dữ liệu được hiển thị. Hai nút giao tiếp phải sử dụng một ngôn ngữ chung để biểu diễn dữ liệu. Nhờ lớp này, sự thống nhất được thực hiện thông qua ngôn ngữ được sử dụng.  

### 7. Lớp ứng dụng (Application layer)
Lớp ứng dụng là lớp thứ 7 và cũng là lớp cuối cùng trong mô hình OSI. Lớp ứng dụng là lớp gần người dùng nhất và cung cấp quyền truy cập vào các cấu trúc được tìm thấy trong mô hình OSI cấp người dùng.  
Trong phần này của khóa đào tạo, chúng ta sẽ thảo luận về mô hình OSI là gì, cấu trúc và các lớp của nó. Trong phần tiếp theo của khóa đào tạo, “Các thiết bị mạng” sẽ được giải thích.

---

# Thiết bị mạng

Trong mạng máy tính, có các thiết bị mạng, mỗi thiết bị đảm nhiệm một nhiệm vụ riêng biệt. Nếu thiếu các thành phần này, mạng máy tính không thể hoàn thành nhiệm vụ của mình. Do đó, việc hiểu rõ nhiệm vụ và khả năng của các thiết bị mạng cho phép giải quyết các vấn đề trong mạng và nhận biết các lỗ hổng bảo mật. Bằng cách này, giải pháp được tìm ra bằng cách hành động nhanh chóng

## Công tắc (Switch)
Theo mô hình tham chiếu OSI, switch là một trong những thiết bị mạng hoạt động ở lớp 2. Tuy nhiên, một số switch có nhiều tính năng quản lý hơn lại hoạt động ở lớp 3 theo mô hình tham chiếu OSI. Switch là thiết bị kết nối và được sử dụng để kết nối các nút muốn kết nối với mạng. Kích thước của switch có thể khác nhau tùy thuộc vào số lượng cổng trên đó.

![[net17.gif]]

Như đã thấy ở trên, thiết bị chuyển mạch chỉ truyền dữ liệu từ cổng nguồn đến cổng đích, do đó nó cung cấp khả năng truyền dữ liệu mà không ảnh hưởng xấu đến hiệu suất mạng. Về mặt bảo mật, nó ngăn chặn dữ liệu thuộc về hai bên tiếp cận bên thứ ba, từ đó tăng cường tính bảo mật dữ liệu.

![[net18.png]]

## Bộ định tuyến (Router)

Bộ định tuyến là một trong những thiết bị mạng hoạt động ở lớp 3 theo mô hình tham chiếu OSI. Bộ định tuyến là thiết bị định tuyến gói tin với các tính năng rất tiên tiến, chứa hệ điều hành (IOS - Internetworking Operating System). Nó là thiết bị mạng được sử dụng bằng cách đặt nó giữa hai mạng máy tính. Ví dụ, nó thường được sử dụng trong các kết nối LAN-LAN và WAN-LAN. Nhiệm vụ cơ bản nhất của bộ định tuyến là định tuyến gói tin và nhờ thiết bị này, các mạng được tách biệt với nhau (phân đoạn). Nói cách khác, nó là một trong những thiết bị phân tách các mạng máy tính với nhau. Nó là một thiết bị có thể cấu hình được.

## Trung tâm (Hub)
Hub là một trong những thiết bị phần cứng mạng hoạt động ở lớp 1 theo mô hình tham chiếu OSI. Thiết bị hub, với cấu trúc rất đơn giản, là một trong những thiết bị được sử dụng để kết nối các máy tính muốn kết nối với mạng.

![[net18.gif]]

## Bộ lặp (Repeater)
Bộ lặp (repeater) là một trong những thiết bị mạng hoạt động ở lớp 1 theo mô hình tham chiếu OSI. Thiết bị bộ lặp chỉ có 2 cổng. Các cổng này chuyển đổi tín hiệu đến thành tín hiệu đi và truyền đến đích. Nó khuếch đại các tín hiệu yếu và cho phép truyền dữ liệu đi xa hơn. Nó là một thiết bị tương tự như hub nhưng không có nhiều cổng như hub.

![[net19.png]]

### Cầu (Bridge)
Theo mô hình tham chiếu OSI, cầu nối là một trong những thiết bị phần cứng mạng hoạt động ở lớp 2. Cầu nối thực hiện định tuyến gói bằng cách kết nối hai mạng máy tính. Mặc dù có nhiệm vụ tương tự như bộ định tuyến, nhưng nó là một thiết bị rất đơn giản với ít cổng hơn bộ định tuyến. Nó cũng khác biệt với bộ định tuyến ở chỗ hoạt động ở lớp 2. Cầu nối có thể được sử dụng trong các kết nối LAN-to-LAN.

![[net20.png]]

### Modem
Modem thường là thiết bị mạng nhỏ gọn, tích hợp các chức năng của một số thiết bị như switch. Nó chứa một hệ điều hành nhỏ. Modem thường được sử dụng trong mạng gia đình để truy cập internet. Nó có thể có một hoặc nhiều cổng. Ngoài ra, đối với các modem hỗ trợ không dây, người dùng có thể kết nối internet bằng cách sử dụng các thiết bị không dây.


### Tường lửa (Firewall)
Theo mô hình tham chiếu OSI, tường lửa là một trong những thiết bị mạng hoạt động ở lớp 4. Tường lửa rất quan trọng đối với phần cứng mạng nằm giữa internet, vốn được coi là một mạng không an toàn, và mạng hiện có. Nhiệm vụ của tường lửa, một trong những thiết bị mạng cơ bản cần thiết để đảm bảo an ninh mạng, là chặn hoặc cho phép lưu lượng truy cập theo các quy tắc nhất định. Mặc dù có nhiều loại, nhưng loại tường lửa được sử dụng phổ biến và biết đến nhiều nhất là các thiết bị tường lửa mạng phần cứng. Chỉ có thiết bị tường lửa thôi là chưa đủ để bảo vệ mạng khỏi các mối đe dọa bên ngoài. Bởi vì kẻ tấn công thậm chí có thể xâm nhập vào mạng có tường lửa. Tường lửa phải được cấu hình đúng cách. Cấu hình tường lửa không đầy đủ và không chính xác có thể ảnh hưởng tiêu cực đến hiệu suất mạng, cũng như gây ra các lỗ hổng bảo mật.

![[net21.png]]

### Cổng (Gateway)

Gateway là một trong những thiết bị mạng có thể hoạt động ở mọi lớp theo mô hình OSI. Gateway là một thành phần mạng cung cấp khả năng giao tiếp giữa các mạng, nằm giữa hai mạng khác nhau. Nói cách khác, nó kết nối các mạng. Mặc dù chức năng tương tự như router, nhưng nó khác với router ở khả năng hoạt động ở mọi lớp. Ngoài ra, không chỉ có gateway phần cứng mà còn có cả gateway phần mềm. Gateway đóng vai trò là cổng cho các nút khác trong mạng. Thông qua thiết bị này, chúng có thể truy cập ra khỏi mạng và giao tiếp với một nút trong mạng khác.

![[net22.png]]

---

# Mô hình TCP/IP

## Mô hình TCP/IP là gì?

Mô hình TCP/IP được thiết kế và phát triển bởi Bộ Quốc phòng (DoD) vào những năm 1960. Khi mô hình TCP/IP được giới thiệu, chưa có mô hình nào thiết lập các tiêu chuẩn trong giao tiếp mạng máy tính. Với mô hình này, người ta đã xác định cách thức giao tiếp mạng nên diễn ra trên cơ sở internet. Mô hình TCP/IP có kiến ​​trúc phân lớp và bao gồm 4 lớp:  
- Lớp ứng dụng
- Lớp vận chuyển
- Lớp Internet
- Lớp truy cập mạng

![[Pasted image 20260402035004.png]]

### Lớp truy cập mạng (Network Access Layer)

Lớp truy cập mạng là lớp đầu tiên trong mô hình TCP/IP. Nó tương ứng với lớp 1 và lớp 2 trong mô hình tham chiếu OSI. Lớp này bao gồm các truy cập vật lý và điều khiển phần cứng.  
  

### Lớp Internet (Internet Layer)

Lớp Internet là lớp thứ 2 trong mô hình TCP/IP. Nó có các chức năng tương tự như lớp 3 trong mô hình tham chiếu OSI. Ở lớp này, các chức năng truyền thông mạng được thực hiện bằng cách sử dụng địa chỉ logic.  
  

### Lớp vận chuyển (Transport Layer)

Lớp vận chuyển là lớp thứ 3 trong mô hình TCP/IP. Nó có chức năng tương tự như lớp 4 trong mô hình tham chiếu OSI. Ở lớp này, việc truyền dữ liệu được thực hiện và độ tin cậy của quá trình truyền thông được đảm bảo. Việc dữ liệu được truyền tải chính xác mà không bị lỗi được quản lý ở lớp này.  
  

### Lớp ứng dụng (Application Layer)

Lớp ứng dụng là lớp thứ 4 và cũng là lớp cuối cùng trong mô hình TCP/IP. Đây là lớp bao gồm tất cả các hoạt động được thực hiện trong các lớp 5, 6 và 7 của mô hình tham chiếu OSI. Các điều khiển và hoạt động ở cấp độ ứng dụng được thực hiện trong lớp này.  
  

## Mô hình OSI so với mô hình TCP/IP

Mặc dù mô hình tham chiếu OSI và mô hình TCP/IP rất giống nhau, nhưng chúng vẫn khác biệt ở một số điểm. Khi mô hình TCP/IP xuất hiện lần đầu, nó ra đời từ nhu cầu thiết yếu chứ không nhằm mục đích trở thành một tiêu chuẩn. Mặt khác, mô hình tham chiếu OSI hướng đến việc thiết kế hệ thống truyền thông mạng lý tưởng, bao gồm cả lý thuyết và ứng dụng thực tiễn. Mô hình TCP/IP được phát triển dựa trên một số giao thức. Trong khi đó, mô hình OSI không được phát triển dựa trên bất kỳ giao thức nào.

![[Pasted image 20260402035047.png]]

---

# Cơ chế định địa chỉ IP
Khi tạo mạng máy tính TCP/IP, trước tiên phải gán một địa chỉ logic (địa chỉ IP) cho mỗi thiết bị trong mạng. Quá trình gán địa chỉ này được gọi là "Cơ chế gán địa chỉ IP". Nếu một thiết bị trong mạng không được gán địa chỉ IP, nó không thể giao tiếp với các thiết bị bên trong hoặc bên ngoài mạng.  
  

## Địa chỉ IP là gì?
Địa chỉ IP là mã định danh địa chỉ mạng của thiết bị. Các thao tác kết nối được thực hiện bằng cách sử dụng địa chỉ IP. Địa chỉ IP được chia thành IPv4 và IPv6. Ví dụ về cả hai loại địa chỉ IP như sau:  
  
**IPv4:** 192.168.4.1  
**IPv6:** 2001:0db8:85a3:0000:0000:8a2e:0370:7334  
  

## Cấu trúc của địa chỉ IP
Địa chỉ IP bao gồm 4 byte (32 bit). Dấu chấm được đặt giữa mỗi byte và được biểu diễn bằng ký hiệu thập phân. Ví dụ, hình ảnh bên dưới cho thấy sự chuyển đổi địa chỉ IP giữa dạng nhị phân và dạng thập phân:

![[net23.png]]
 
Vì mỗi byte gồm 8 bit, nên giá trị 8 bit phải là "0" (không) để mỗi byte nhận được giá trị nhỏ nhất. Tương tự, giá trị 8 bit phải là "1" để mỗi byte nhận được giá trị lớn nhất. Ví dụ, hãy tính giá trị nhỏ nhất và lớn nhất mà mỗi byte trong địa chỉ IP có thể nhận:  
  
**Nhỏ nhất (Nhị phân)** : 00000000

![[net24.png]]

Như kết quả tính toán cho thấy, giá trị thập phân tương ứng của biểu thức nhị phân "00000000" là "0" (số không).  
  
**Giá trị tối đa (nhị phân)** : 11111111

![[net25.png]]

## Các lớp địa chỉ IP

Địa chỉ IP được chia thành 5 lớp. Để xác định lớp của địa chỉ IP, người ta kiểm tra byte đầu tiên của địa chỉ IP. Dựa vào giá trị thập phân của byte đầu tiên, người ta xác định được địa chỉ IP thuộc lớp nào trong bảng bên dưới.

![[net26.png]]

Có thể xác định thiết bị có địa chỉ IP đó thuộc mạng nào thông qua địa chỉ IP của nó. Để biết được thông tin này, trước hết cần phải biết địa chỉ IP đó thuộc lớp nào. Sau đó, kiểm tra các trường “Network Bits” trong bảng bên dưới.

![[net27.png]]

Ví dụ, hãy cùng tìm hiểu xem địa chỉ IP "192.168.4.1" thuộc lớp nào và byte nào là bit mạng:  
**Bước 1:** Kiểm tra giá trị thập phân của byte đầu tiên: "192"  
**Bước 2:** Dựa vào bảng, ta biết giá trị “192” thuộc lớp nào: “Lớp C”  
**Bước 3:** Dựa vào bảng, ta kiểm tra xem byte nào của địa chỉ IP thuộc lớp “C” là bit mạng: “3 byte đầu tiên”  
  
Dựa trên thông tin thu được, có thể nói rằng các địa chỉ IP có cùng 3 byte đầu tiên thuộc về các thiết bị trong cùng một mạng. Ví dụ, địa chỉ IP “192.168.4.1” và địa chỉ IP “192.168.4.2” nằm trên cùng một mạng. Bởi vì chỉ có sự khác biệt ở byte chứa bit máy chủ. Bit mạng có cùng giá trị: 192.168.4.X

![[net28.png]]

## IPv6 là gì?
Hiện nay, số lượng thiết bị kết nối với mạng internet khá cao. Xét đến việc tất cả các thiết bị này đều có địa chỉ IP, IPv4 không còn đáp ứng đủ nhu cầu. Vì lý do đó, một số công nghệ như NAT và IPv6 đã được phát triển để giải quyết vấn đề này. Với IPv6, việc sử dụng IPv4, vốn có số lượng địa chỉ hạn chế, đã bắt đầu giảm và nhường chỗ cho IPv6. Bảng dưới đây so sánh IPv4 và IPv6:

![[net29.png]]

## Địa chỉ IP riêng
Một số địa chỉ IP được dành riêng cho các mục đích đặc biệt. Các địa chỉ IP dành riêng này được sử dụng trong mạng riêng. Mạng riêng là mạng không được kết nối trực tiếp với Internet mà được kết nối với Internet thông qua một thiết bị mạng trung gian. Ví dụ: mạng gia đình và mạng nội bộ. Trong mạng gia đình, thiết bị modem cung cấp kết nối Internet và quản lý luồng gói dữ liệu. Thiết bị modem có một giao diện mạng hướng về mạng gia đình và một giao diện mạng hướng về phía Internet. Phần được gọi là mạng riêng là phần chứa giao diện mạng gia đình của thiết bị modem. Các địa chỉ IP của các thiết bị trong phần này là các địa chỉ IP dành riêng không được sử dụng trong môi trường Internet. Bảng sau đây hiển thị các dải địa chỉ IP riêng:

![[net30.png]]

## localhost là gì?
Localhost là dải địa chỉ IP chỉ định địa chỉ mạng riêng của thiết bị. Nó được sử dụng để truy cập các dịch vụ chạy cục bộ trên thiết bị. Nó thường được biết đến với tên gọi địa chỉ IP "127.0.0.1". Tuy nhiên, bất kỳ địa chỉ IP nào trong phạm vi “127.0.0.1 - 127.255.255.255” đều có thể được sử dụng cho mục đích này. Một tên gọi khác là địa chỉ "loopback".

---

# Dịch địa chỉ mạng (NAT)

Dịch địa chỉ mạng (NAT) là một phương pháp chuyển đổi địa chỉ IP riêng thành địa chỉ IP công cộng. Vì địa chỉ IP riêng là địa chỉ IP không định tuyến, nên chúng không thể được sử dụng trên internet. Các địa chỉ IP này chỉ cho phép giao tiếp trong mạng cục bộ. Nhờ NAT, số lượng địa chỉ IPv4 hạn chế được sử dụng tiết kiệm hơn. Ngoài ra, NAT còn cung cấp một dạng phân đoạn mạng. Điều này có lợi trong việc kiểm soát và bảo mật các kết nối đến từ bên ngoài mạng. Để sử dụng phương pháp NAT, thiết bị có cổng (gateway) phải thực hiện định tuyến gói tin. Thiết bị này có bảng NAT và việc chuyển đổi địa chỉ IP được thực hiện bằng cách xem bảng này.  

## Ưu điểm và nhược điểm của NAT

Mặc dù NAT thường được sử dụng như một giải pháp cho vấn đề hết địa chỉ IPv4, nhưng nó cũng có một số nhược điểm. Một số ưu điểm và nhược điểm có thể được thấy trong bảng dưới đây.

![[net31.png]]

## Ví dụ về NAT

![[net32.png]]

Khi thiết bị có địa chỉ IP 10.6.1.2 truy cập Internet, trước tiên nó phải truyền gói tin đến thiết bị cổng (gateway) cung cấp đường truyền Internet. Thiết bị cổng nhận gói tin sẽ xác định mạng mà nó sẽ chuyển tiếp gói tin đến và địa chỉ đích bằng cách xem xét các trường thông tin trong gói tin. Sau khi thấy rằng nó có địa chỉ IP thuộc về Internet, nó sẽ thực hiện các thay đổi đối với gói tin bằng cách sử dụng thông tin trong bảng NAT, nói cách khác, nó thực hiện chuyển đổi NAT. Sau khi chuyển đổi, nó chuyển tiếp gói tin đến thiết bị mạng tiếp theo để chuyển tiếp gói tin đến địa chỉ IP đích. Khi gói tin phản hồi đến, nó sẽ chuyển hướng gói tin đến thiết bị có liên quan trong mạng nội bộ bằng cách thực hiện các thao tác tương tự ngược lại, và việc truyền gói tin được thực hiện cùng với các biến đổi NAT.  
