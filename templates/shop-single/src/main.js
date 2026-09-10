// 용량 옵션을 고르면 가격 표시를 바꾼다.
// 버튼에 data-price 만 붙이면 되고, 옵션을 늘려도 이 파일은 고치지 않아도 된다.
const options = document.querySelectorAll('.option');
const priceLabel = document.querySelector('.price strong');

// 할인 전 가격은 정가 대비 비율로 함께 움직인다. 한쪽만 바뀌면 할인율이 거짓말이 된다.
const base = Number(document.querySelector('.option[aria-pressed="true"]')?.dataset.price ?? 0);
const listPrice = Number(String(document.querySelector('.price del')?.textContent ?? '').replace(/\D/g, ''));
const ratio = base > 0 && listPrice > 0 ? listPrice / base : 0;

const won = new Intl.NumberFormat('ko-KR');

options.forEach((option) => {
  option.addEventListener('click', () => {
    options.forEach((other) => other.setAttribute('aria-pressed', String(other === option)));

    const price = Number(option.dataset.price);
    if (!Number.isFinite(price)) return;

    if (priceLabel) priceLabel.textContent = `${won.format(price)}원`;

    const del = document.querySelector('.price del');
    // 100원 단위로 맞춘다. 그냥 곱하면 58,378원 같은 값이 나와 정가로 보이지 않는다.
    if (del && ratio > 0) del.textContent = `${won.format(Math.round((price * ratio) / 100) * 100)}원`;
  });
});
