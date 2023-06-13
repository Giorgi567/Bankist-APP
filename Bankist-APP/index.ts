// Data
interface Account {
  owner: string;
  movements: number[];
  interestRate: number;
  pin: number;
  username?: string;
  balance?: number;
}

const account1: Account = {
  owner: "Giorgi Gvintidze",
  movements: [200, 450, -400, 3000, 250000, -650, -130, 70, 1300, -230],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2: Account = {
  owner: "Luka Surabelashvili",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3: Account = {
  owner: "Leqso Kvaracxelia",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4: Account = {
  owner: "Nika Gamsaxurdia",
  movements: [430, 1000, 700, 50, 90, 20],
  interestRate: 1,
  pin: 4444,
};

const accounts: Account[] = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".Welc") as HTMLElement;
const labelDate = document.querySelector(".child-text") as HTMLElement;
const labelBalance = document.querySelector(".total-money") as HTMLElement;
const labelSumIn = document.querySelector(".inTotal") as HTMLElement;
const labelSumOut = document.querySelector(".outTotal") as HTMLElement;
const labelSumInterest = document.querySelector(".totalIntrest") as HTMLElement;

const containerApp = document.querySelector(".main-content") as HTMLElement;
const containerMovements = document.querySelector(
  ".transaction-section"
) as HTMLElement;

const btnLogin = document.querySelector(".submit-btn") as HTMLElement;
const btnTransfer = document.querySelector(".submit-transfer") as HTMLElement;
const btnLoan = document.querySelector(".submit-loan") as HTMLElement;
const btnClose = document.querySelector(".submit-delete") as HTMLElement;
const btnSort = document.querySelector(".Avrage-Sort") as HTMLElement;

const inputLoginUsername = document.querySelector(
  ".user-input-username"
) as HTMLInputElement;
const inputLoginPin = document.querySelector(
  ".user-input-pin"
) as HTMLInputElement;
const inputTransferTo = document.querySelector(
  ".inputof-name"
) as HTMLInputElement;
const inputTransferAmount = document.querySelector(
  ".inputof-number-transfer"
) as HTMLInputElement;
const inputLoanAmount = document.querySelector(
  ".inputof-number"
) as HTMLInputElement;
const inputCloseUsername = document.querySelector(
  ".inputof-delete-name"
) as HTMLInputElement;
const inputClosePin = document.querySelector(".inputof-id") as HTMLInputElement;

// Displaying/sorting already made transactions
const displayMovements = function (movements: number[], sort = false) {
  containerMovements.innerHTML = "";

  // sorts transactions depending on if it's already sorted or not
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  // displaying already made transactions
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "DEPOSIT" : "WITHDRAWAL";

    const html = `
    <div class="transacton transacton_${type}-row" >
     <div class="transaction-Information transaction-Information-${type}">
       <div class="WITHDRAWAL_DEPOSIT_box WITHDRAWAL_DEPOSIT_box-${type}">
       <Strong class="statemnt-class statemnt-class-WITHDRAWAL"> ${type}</Strong>
     <h2 class="dateOfTransaction dateOfTransaction-${type}" >3 DAYS AGO</h2>
    <div class="moneyamout moneyamout-${type}">${mov}€</div>
`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// creating Short usernames
const userNameCreation = function (accs: Account[]) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
userNameCreation(accounts);

// Calculating accounts balance
const calculateBalance = function (account: Account) {
  account.balance = account.movements.reduce((acc, money) => acc + money);
  const formattedBalance = account.balance
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  labelBalance.textContent = `${formattedBalance}€`;
};

// Calculating total money in the account
const totalMoneyInAcc = function (movs: number[]) {
  const totalIn = movs
    .filter((money) => money > 0)
    .reduce((acc, money) => acc + money);

  const formattedTotalIn = totalIn
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  labelSumIn.textContent = `${formattedTotalIn}€`;
};

// Calculating total money sent from the account
const totalMoneyOutAcc = function (movs: number[]) {
  const totalOut = movs
    .filter((money) => money < 0)
    .reduce((acc, money) => acc + money);

  const formattedTotalOut = Math.abs(totalOut)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  labelSumOut.textContent = `${formattedTotalOut}€`;
};

// Calculating interest on each account individually
const calcInterest = function (acc: Account) {
  const totalInterest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  const formattedTotalInterest = Math.round(totalInterest)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  labelSumInterest.textContent = `${formattedTotalInterest}%`;
};

// gathering (displayMovements, calculateBalance, totalMoneyInAcc, totalMoneyOutAcc, calcInterest) in one function
// so I won't have to call each function individually
const calculateTotal = function (acc: Account) {
  displayMovements(acc.movements);

  calculateBalance(acc);

  totalMoneyInAcc(acc.movements);

  totalMoneyOutAcc(acc.movements);

  calcInterest(acc);
};

let currentAcc: Account | undefined; // variable that lets me know which account is currently open on the website

// this addEventListener function checks if credentials are correct when you are logging in and if credentials are
// correct, it will open the banking page
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAcc = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (
    currentAcc?.username === inputLoginUsername.value &&
    currentAcc.pin === Number(inputLoginPin.value)
  ) {
    containerApp.style.opacity = "100"; // makes entire content appear on the screen

    calculateTotal(currentAcc); // displaying already made transactions on the website
  }
  inputLoginUsername.value = "";
  inputLoginPin.value = "";
  labelWelcome.textContent = `Welcome ${currentAcc?.owner}`;
});

// this addEventListener transfers money to another account while of course subtracting the transferred amount of money
// from the current account and receiver account gets transferred amount of money added to his/her bank account
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const giverAcc = currentAcc; // saving activated account in a variable
  const receiverAccount = accounts.find((acc) => {
    // finding the receiver account
    return acc.username === inputTransferTo.value;
  });
  const amount = Number(inputTransferAmount.value); // saving transferred money in the variable for later use

  if (
    // basic transferring logic before transferring money
    giverAcc &&
    receiverAccount &&
    amount &&
    giverAcc.username !== receiverAccount.username &&
    amount > 0 &&
    currentAcc.balance >= amount
  ) {
    giverAcc.movements.push(-amount); // this adds withdrawal to the current account
    receiverAccount.movements.push(amount); // this adds deposited money to the receiver account

    calculateTotal(giverAcc); // calling this function again because we want to see the changes in UI after transfer
  }

  inputTransferAmount.value = "";
  inputTransferTo.value = "";
});

// this addEventListener takes a loan from the bank and updates the UI elements connected to this transaction
// you can only take a loan from the bank if any of your deposits 10% > the amount of the loan you are asking for
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const totalIn = currentAcc.movements.filter((money) => {
    // filters an array and only returns positive numbers aka deposits
    return money > 0;
  });

  const percentCheck = totalIn.some(function (money) {
    // checks if given numbers/deposits from totalIn is 10% of the loan
    return money / 10 > Number(inputLoanAmount.value);
  });

  if (Number(inputLoanAmount.value) > 0 && percentCheck) {
    currentAcc.movements.push(Number(inputLoanAmount.value));
    calculateTotal(currentAcc); // Updating UI
  }
  inputLoanAmount.value = "";
});

// this addEventListener checks if the given credentials are correct and makes sure that the currently opened account
// cannot delete another account. By matching the given credentials and currently open the account's credentials and only
// then this addEventListener deletes an account from the Data mentioned at the start of this file
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    // checks if credentials are correct
    Number(inputClosePin.value) === currentAcc?.pin &&
    inputCloseUsername.value === currentAcc?.username
  ) {
    const targetAccount = accounts.findIndex((acc) => {
      // finding the index of the account we want to delete from the array
      return (
        acc.username === currentAcc?.username && acc.pin === currentAcc?.pin
      );
    });
    containerApp.style.opacity = "0"; // making UI disappear
    accounts.splice(targetAccount, 1); // Deleting an account from the "accounts" array at the top
  }
  inputCloseUsername.value = "";
  inputClosePin.value = "";
});

// this addEventListener sorts the array if the array is already sorted in ascending order then this addEventListener
// sorts the array in descending order and vice versa
let sorted = false; // Variable lets me know if the transactions are already sorted or not
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAcc!.movements, !sorted);
  sorted = !sorted;
});
