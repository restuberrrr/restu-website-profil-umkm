const api = 'api.php';
const ids = ['id', 'name', 'category', 'price', 'description'];
const el = Object.fromEntries(ids.map((id) => [id, document.querySelector(`#${id}`)]));
let products = [];

const money = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

async function load() {
  products = await (await fetch(api)).json();
  render();
}

function render() {
  document.querySelector('#catalog').innerHTML = products.map((product) => `
    <article class="product">
      <span>${product.category}</span>
      <h3>${product.name}</h3>
      <strong class="price">${money(product.price)}</strong>
      <p>${product.description}</p>
      <div class="actions"><button class="small" data-action="edit" data-id="${product.id}">Edit</button><button class="small danger" data-action="delete" data-id="${product.id}">Hapus</button></div>
    </article>`).join('');
}

document.querySelector('#form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(ids.filter((id) => id !== 'id').map((id) => [id, el[id].value]));
  await fetch(el.id.value ? `${api}?id=${el.id.value}` : api, {
    method: el.id.value ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  event.target.reset();
  el.id.value = '';
  load();
});

document.querySelector('#reset').addEventListener('click', () => {
  document.querySelector('#form').reset();
  el.id.value = '';
});

document.querySelector('#catalog').addEventListener('click', async (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const product = products.find((item) => item.id === button.dataset.id);
  if (button.dataset.action === 'delete') {
    await fetch(`${api}?id=${button.dataset.id}`, { method: 'DELETE' });
    load();
  }
  if (button.dataset.action === 'edit' && product) {
    ids.forEach((id) => (el[id].value = product[id] || ''));
    document.querySelector('#admin').scrollIntoView({ behavior: 'smooth' });
  }
});

load();

