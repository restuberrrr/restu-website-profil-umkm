import { supabaseRequest } from './supabase.js';

const table = 'portfolio_umkm_products';
const ids = ['id', 'name', 'category', 'price', 'description'];
const el = Object.fromEntries(ids.map((id) => [id, document.querySelector(`#${id}`)]));
let products = [];

const money = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

async function load() {
  products = await supabaseRequest(table);
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
  payload.price = Number(payload.price);
  await supabaseRequest(table, {
    method: el.id.value ? 'PATCH' : 'POST',
    id: el.id.value || undefined,
    body: payload,
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
  const product = products.find((item) => String(item.id) === button.dataset.id);
  if (button.dataset.action === 'delete') {
    await supabaseRequest(table, { method: 'DELETE', id: button.dataset.id });
    load();
  }
  if (button.dataset.action === 'edit' && product) {
    ids.forEach((id) => (el[id].value = product[id] || ''));
    document.querySelector('#admin').scrollIntoView({ behavior: 'smooth' });
  }
});

load();
