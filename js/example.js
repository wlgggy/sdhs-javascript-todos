console.log("example");

const $div = document.createElement("div");
console.log($div.outerHTML);
// class 를 a b c 추가
$div.classList.add("a", "b", "c");
console.log($div.outerHTML);
// class d 추가
$div.classList.add("d");
console.log($div.outerHTML);
// class b 삭제
$div.classList.remove("b");
console.log($div.outerHTML);
// class a 가 있는지 검사
console.log($div.classList.contains("a"), $div.outerHTML);
// class a 가 있을경우 c 삭제
if ($div.classList.contains("a")) {
  $div.classList.remove("c");
  console.log($div.outerHTML);
}
$div.classList.remove("a");
