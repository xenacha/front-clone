/* html - form 으로부터 들어온 데이터를 서버로 전송 */

const form = document.getElementById("write-form");

const handleSubmitForm = async (event) => {
  event.preventDefault(); // 제출 즉시 자동 새로고침 (기록 삭제) -> 리로드 막음
  console.log("제출");

  try {
    const res = await fetch("/items", {
      method: "POST",
      body: new FormData(form), //formData 로 전송
    });

    console.log("제출완료!");

    /* 제출완료 시 홈으로 이동 */
    const data = await res.json();
    if (data === "200") window.location.pathname = "/";
  } catch (e) {
    console.error(e);
  }
};

form.addEventListener("submit", handleSubmitForm);
