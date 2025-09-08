/* html - form 으로부터 들어온 데이터를 서버로 전송 */

const form = document.getElementById("write-form");

const handleSubmitForm = async (event) => {
  event.preventDefault(); // 제출 즉시 자동 새로고침 기능(reload:기록 삭제) 막음

  const body = new FormData(form); // formData 객체 생성

  // 현재 시간 추가: 세계시간
  body.append("insertAt", new Date().getTime());

  try {
    const res = await fetch("/items", {
      method: "POST",
      body, //new FormData(form), //formData 로 전송
    });

    console.log("제출완료!");

    /* 제출완료 시 홈으로 이동 */
    const data = await res.json();
    if (data === "200") window.location.pathname = "/"; // "/" path -> 홈
  } catch (e) {
    console.error(e); // 이미지 업로드 실패 시 에러 출력
    alert("이미지 업로드 실패");
  }
};

form.addEventListener("submit", handleSubmitForm);
