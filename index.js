'use strict';

// Data
const account1 = {
  owner: 'Giorgi Gvintidze',
  movements: [200, 450, -400, 3000, 250000, -650, -130, 70, 1300, -230],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Luka Surabelashvili',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Leqso Kvaracxelia',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Nika Gamsaxurdia',
  movements: [430, 1000, 700, 50, 90, 20],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.Welc');
const labelDate = document.querySelector('.child-text');
const labelBalance = document.querySelector('.total-money');
const labelSumIn = document.querySelector('.inTotal');
const labelSumOut = document.querySelector('.outTotal');
const labelSumInterest = document.querySelector('.totalIntrest');

const containerApp = document.querySelector('.main-content');
const containerMovements = document.querySelector('.transaction-section');

const btnLogin = document.querySelector('.submit-btn');
const btnTransfer = document.querySelector('.submit-transfer');
const btnLoan = document.querySelector('.submit-loan');
const btnClose = document.querySelector('.submit-delete');
const btnSort = document.querySelector('.Avrage-Sort');

const inputLoginUsername = document.querySelector('.user-input-username');
const inputLoginPin = document.querySelector('.user-input-pin');
const inputTransferTo = document.querySelector('.inputof-name');
const inputTransferAmount = document.querySelector('.inputof-number-transfer');
const inputLoanAmount = document.querySelector('.inputof-number');
const inputCloseUsername = document.querySelector('.inputof-delete-name');
const inputClosePin = document.querySelector('.inputof-id');

// Displaying/sorting alredy made transactions
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  //sorts transactions depening on if its alredy sorted or ot
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  // displaying an alredy and after  made transactions
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'DEPOSIT' : 'WITHDRAWAL';

    const html = `
    <div class="transacton transacton_${type}-row" >
     <div class="transaction-Information transaction-Information-${type}">
       <div class="WITHDRAWAL_DEPOSIT_box WITHDRAWAL_DEPOSIT_box-${type}">
       <Strong class="statemnt-class statemnt-class-WITHDRAWAL"> ${type}</Strong>
     <h2 class="dateOfTransaction dateOfTransaction-${type}" >3 DAYS AGO</h2>
    <div class="moneyamout moneyamout-${type}">${mov}€</div>

`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// creating Short usernames
const userNameCreation = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
userNameCreation(accounts);

// Calculating accoutns balance
const calculateBalance = function (account) {
  account.balance = account.movements.reduce((acc, money) => acc + money);
  const formattedBalance = account.balance
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  labelBalance.textContent = `${formattedBalance}€`;
};

// Claculating total money in the account
const totalMoneyInAcc = function (movs) {
  const totalIn = movs
    .filter(money => money > 0)
    .reduce((acc, money) => acc + money);

  const formattedTotalIn = totalIn
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  labelSumIn.textContent = `${formattedTotalIn}€`;
};

// Calcualting total money sent from the account
const totalMoneyOutAcc = function (movs) {
  const totalOut = movs
    .filter(money => money < 0)
    .reduce((acc, money) => acc + money);

  const formattedTotalOut = Math.abs(totalOut)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  labelSumOut.textContent = `${formattedTotalOut}€`;
};

// Calculating intrest on each account individually
const calcIntrest = function (acc) {
  const totalInterest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  const formattedTotalInterest = Math.round(totalInterest)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  labelSumInterest.textContent = `${formattedTotalInterest}%`;
};

// gathering (displayMovements, calculateBalance, totalMoneyInAcc, totalMoneyOutAcc, calcIntrest) in one function
// so i wont have to call each function individually
const calcualteTotal = function (acc) {
  displayMovements(acc.movements, sort);

  calculateBalance(acc);

  totalMoneyInAcc(acc.movements);

  totalMoneyOutAcc(acc.movements);

  calcIntrest(acc);
};

let currentAcc; //variable that lets me know which accoutn is currently open on the website

// this addEventListener function checks if credentials are correct when you are logining in and if credentials are
// correct it will open the banking page
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAcc = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (
    currentAcc?.username === inputLoginUsername.value &&
    currentAcc.pin === Number(inputLoginPin.value)
  ) {
    containerApp.style.opacity = 100; //makes entire content appear on the screen

    calcualteTotal(currentAcc); //displaying alredy made transactions on the website
  }
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  labelWelcome.textContent = `Welcome ${currentAcc.owner}`;
});

// this addEventListener transfers money to another account while of course subtracting the transfered amount of money
// to the current account and reciver account gets transfered amout of money added to his/her's bank account
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const giverAcc = currentAcc; //saving activated account in a variable
  const reciverAccount = accounts.find(acc => {
    //finding the reciver account
    return acc.username === inputTransferTo.value;
  });
  const amount = Number(inputTransferAmount.value); //saving transfered money in the variable for later use

  if (
    //basic transfering logic before transfering money
    giverAcc &&
    reciverAccount &&
    amount &&
    giverAcc.username !== reciverAccount.username &&
    amount > 0 &&
    currentAcc.balance >= amount
  ) {
    giverAcc.movements.push(-amount); //this adds withdrawal to the current account
    reciverAccount.movements.push(amount); //this adds deposited money on the reciver accoutn

    calcualteTotal(giverAcc); //calling this function again because we want to see the changes in UI after transfer
  }

  inputTransferAmount.value = '';
  inputTransferTo.value = '';
});

// this addEventListener takes loan from the bank and updates the UI's which are connected to this transaction
// you can only take loan from the bank if any of your deposit's 10% > amount of loan you are asking for
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const totalIn = currentAcc.movements.filter(money => {
    //filters an array and only returns positive numbers aka.deposits
    return money > 0;
  });

  const precentCheck = totalIn.some(function (money) {
    //checks if given numbers/deposits from totalIn is 10% of the loan
    return money / 10 > Number(inputLoanAmount.value);
  });

  if (Number(inputLoanAmount.value) > 0 && precentCheck) {
    currentAcc.movements.push(Number(inputLoanAmount.value));
    calcualteTotal(currentAcc); // Updateing UI
  }
  inputLoanAmount.value = '';
});

// this addEventListener checks if the given credentials are correct and makes sure that the currently opened account
// can not delete another account. By matching the given credentials and currently open the account's credentials and only
// then this addEventListener delets an account from the Data mentioned at the start of this file
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    //checks if credentials are correct
    Number(inputClosePin.value) === currentAcc.pin &&
    inputCloseUsername.value === currentAcc.username
  ) {
    const targetAccoutn = accounts.findIndex(acc => {
      //finding the index of the account we want to delet from the array
      return acc.username === currentAcc.username && acc.pin === currentAcc.pin;
    });
    containerApp.style.opacity = 0; //making UI disappear
    accounts.splice(targetAccoutn, 1); //Deleting an accoutn from the "accounts" array at the top
  }
  inputCloseUsername.value = '';
  inputClosePin.value = '';
  inputLoginPin.value = '';
  inputLoginUsername.value = '';
  labelWelcome.textContent = 'Login to get started';
});

let sort = false;
//this addEventListener sorts transactions from highest to lowest
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAcc.movements, !sort);
  sort = !sort;
});
