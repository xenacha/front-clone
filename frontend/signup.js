// signup form 을 가져와서
const form = document.querySelector("#signup-form");

const checkPassword = (password) => {
  const formData = new FormData(form); // form 데이터 가져오기
  const password1 = formData.get("password");
  const password2 = formData.get("password2");

  if (password1 == password2) {
    return true;
  } else return false;
};

// submit 이벤트가 발생했을 때 호출되는 함수
const handleSubmit = async (event) => {
  event.preventDefault(); // 새로고침 방지

  const formData = new FormData(form); // form 데이터 가져오기
  const sha256Password = sha256(formData.get("password")); // 패스워드 해시 처리
  formData.set("password", sha256Password); // 패스워드 해시 처리

  //console.log(formData.get("password")); // 해시된 패스워드 확인

  const div = document.querySelector("#info");

  if (checkPassword()) {
    //패스워드가 일치 -> 해시 처리된 form 데이터 전송

    const res = await fetch("/signup", {
      method: "POST",
      body: formData,
    });

    const data = await res.json(); // 서버에서 회원가입 성공데이터를 보낸 경우 프론트에 띄움
    if (data.result == "200") {
      /*      div.innerText = "회원가입 성공!";
      div.style.color = "blue"; */
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      window.location.pathname = "/login.html"; // 로그인 페이지로 이동
    }
  } else {
    //패스워드 일치 X
    div.innerText = "비밀번호가 일치하지 않습니다.";
    div.style.color = "red";
  }
};

//submit 이벤트 발생 시
form.addEventListener("submit", handleSubmit);
