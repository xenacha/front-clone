//
const calcTime = (timestamp) => {
  //한국시간 UTC +9 으로 출력 -> - 9시간처리 필요
  const now = new Date().getTime() - 9 * 60 * 60 * 1000; // 현재 시간
  const time = new Date(now - timestamp); // 현재 시간 - 업로드 시간 = 경과 시간
  const hour = time.getHours();
  const min = time.getMinutes();
  const sec = time.getSeconds();

  //return `${hour}시간 ${min}분 ${sec}초 전`;

  // 경과시간이 0일 경우
  // 경과시간이 0보다 클 경우

  if (hour > 0) return `${hour}시간 전`;
  else if (min > 0) return `${min}분 전`;
  else if (sec >= 0) return `${sec}초 전`;
  else return "방금 전";
};

// 데이터를 렌더링하는 함수: 서버로부터 받아온 데이터를 HTML 요소로 변환하여 화면에 표시
const renderData = (data) => {
  const main = document.querySelector("main"); // main 요소 선택

  //forEach: array 형태로 받아온 각각의 data 객체에 => 이하 함수 적용
  // reverse()함수: 나중에 추가되는 데이터가 상단에 오도록 초기화 -> ['a','b','c'].reverse() = ['c','b','a']

  data.reverse().forEach(async (obj) => {
    const div = document.createElement("div"); // div 요소 생성
    div.className = "item-list"; // div 요소에 클래스 이름 추가

    const ImgDiv = document.createElement("div");
    ImgDiv.className = "item-img";

    const InfoDiv = document.createElement("div");
    InfoDiv.className = "item-info";

    const InfoTitle = document.createElement("div"); // img 요소 생성
    InfoTitle.className = "item-info-title"; // img 요소에 src 속성 추가
    InfoTitle.innerText = obj.title; // div 요소에 title 추가

    const InfoMeta = document.createElement("div"); // div 요소 생성
    InfoMeta.className = "item-info-meta"; // div 요소에 클래스 이름 추가
    InfoMeta.innerText = obj.place + " " + calcTime(obj.insertAt); //

    const InfoPrice = document.createElement("div"); // div 요소 생성
    InfoPrice.className = "item-info-price"; // div 요소에 클래스 이름 추가
    InfoPrice.innerText = obj.price; // div 요소에 price 추가

    const Img = document.createElement("img"); // img 요소 생성
    const res = await fetch(`/images/${obj.id}`); // forEach 내부 -> async 함수로 변경
    blob = await res.blob(); // 이미지 데이터를 Blob 형태로 변환
    const url = URL.createObjectURL(blob); // Blob 데이터를 URL로 변환
    Img.src = url; // img 요소에 src 속성 추가

    //div.innerText = obj.title; // div 요소에 title 추가 + 시간: 현재시간 - 업로드 시간

    InfoDiv.appendChild(InfoTitle); // div 요소에 title 추가
    InfoDiv.appendChild(InfoMeta); // div 요소에 place 추가
    InfoDiv.appendChild(InfoPrice); // div 요소에 price 추가
    ImgDiv.appendChild(Img); // div 요소에 img 추가
    div.appendChild(ImgDiv); // div 요소에 img 추가
    div.appendChild(InfoDiv); // div 요소에 info 추가
    main.appendChild(div); // div 요소에 클래스 이름 추가
  });
};

// 서버에 입력된 데이터를 받아옴
const fetchList = async () => {
  const res = await fetch("/items"); //post method 요청 경로 /items 와 get 요청 경로 중복???
  const data = await res.json(); // json 형태로 변환
  console.log(data); // 서버로부터 받아온 데이터 출력
  renderData(data); // 받아온 데이터를 렌더링하는 함수 호출
};

fetchList(); // 함수 실행
