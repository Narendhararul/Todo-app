const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');  
const typeInput = document.getElementById('type');      
const resetButton = document.getElementById('reset-button');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expenses');
const balanceElement = document.getElementById('balance');
const filters = document.querySelectorAll('input[name="filter"]');
const list = document.getElementById('transactions-list');

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function fundTransactions(filter = 'all') {
  list.innerHTML = '';

  const filtered = transactions.filter(transaction =>
    filter === 'all' ? true : transaction.type === filter
  );

  filtered.forEach((transaction, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${transaction.description} - $${transaction.amount} (${transaction.type})</span>
      <div class="actions">
        <button class="edit-button" onclick="editTransaction(${index})">Edit</button>
        <button class="delete-button" onclick="deleteTransaction(${index})">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });

  updateSummary();
}

function updateSummary() {
  const income = transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((accumulator, transaction) => accumulator + transaction.amount, 0);

  const expense = transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((accumulator, transaction) => accumulator + transaction.amount, 0);

  const balance = income - expense;

  totalIncome.textContent = income;
  totalExpense.textContent = expense;
  balanceElement.textContent = balance;
}

form.addEventListener('submit', event => {
  event.preventDefault();

  const transaction = {
    description: descriptionInput.value,
    amount: +amountInput.value,
    type: typeInput.value,
  };

  transactions.push(transaction); 
  saveToLocalStorage();
  fundTransactions();
  form.reset();
});

resetButton.addEventListener('click', () => {
  form.reset();
});

function editTransaction(i) {
  const transactionToEdit = transactions[i];
  descriptionInput.value = transactionToEdit.description;
  amountInput.value = transactionToEdit.amount;
  typeInput.value = transactionToEdit.type;

  transactions.splice(i, 1);
  saveToLocalStorage();
  fundTransactions();
}

function deleteTransaction(i) {
  transactions.splice(i, 1);
  saveToLocalStorage();
  fundTransactions();
}

filters.forEach(filterOption =>
  filterOption.addEventListener('change', event => {
    fundTransactions(event.target.value);
  })
);

fundTransactions();
