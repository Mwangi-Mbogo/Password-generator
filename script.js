
const characters = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-*[]{};:,.<>"
};

const options = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: false,
  symbols: false
};

const passwordText = document.getElementById("passwordText");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const regenerateBtn = document.getElementById("regenerateBtn");
const lengthSlider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");
const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");
const notification = document.getElementById("notification");

const checkboxes = {
  uppercase: document.getElementById("uppercaseCheck"),
  lowercase: document.getElementById("lowercaseCheck"),
  numbers: document.getElementById("numbersCheck"),
  symbols: document.getElementById("symbolsCheck")
}

function getRandomChar(charset){
  return charset.charAt(Math.floor(Math.random() * charset.length));
}

function shuffleString(str){
  const array = str.split("");
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  };

  return array.join();
}

function updateLengthDisplay(){
  lengthValue.textContent = options.length;
}

function toggleOption(option){
  const checkCount = Object.values(options).filter((value, index) =>
    index > 0 && value === true
  ).length;
  if(checkCount === 1 && options[option] === true){
    showNotification("At least one character type must be selected", "error");
    return;
  }
  options[option] = !options[options];
  checkboxes[option].classList.toggle("checked");
}

function generatePassword(){
  let charset = "";

  if(options.uppercase) charset += characters.uppercase;
  if(options.lowercase) charset += characters.lowercase;
  if(options.numbers) charset += characters.numbers;
  if(options.symbols) charset += characters.symbols;

  if(charset === ""){
    showNotification("Please select a least one character type", "error");
    return
  }

  let password = "";
  if(options.uppercase) password += getRandomChar(characters.uppercase);
  if(options.lowercase) password += getRandomChar(characters.lowercase);
  if(options.numbers) password += getRandomChar(characters.numbers);
  if(options.symbols) password += getRandomChar(characters.symbols);

  for(let i = password.length; i < options.length; i++){
    password += getRandomChar(charset);
  }

  password = shuffleString(password);
  passwordText.textContent = password;
  passwordText.classList.add("fade-in");

  setTimeout(() =>{
    passwordText.classList.remove("fade-in");
  }, 500);

  calculateStrength(password);
}

function calculateStrength(password){
  let score = 0;
  let feedback = "";

  if(password.length >= 12) score += 25;
  else if(password.length >= 8) score += 15;
  else if(password.length >= 6) score += 10;
  else score += 5;

  if(/[a-z]/.test(password)) score += 15
  if(/[A-Z]/.test(password)) score += 15
  if(/[0-9]/.test(password)) score += 15
  if(/[^A-Za-z0-9]/.test(password)) score += 20

  if(
    password.length >= 16 && 
    /[a-z]/.test(password) && 
    /[A-Z]/.test(password) && 
    /[0-9]/.test(password) && 
    /[^A-Za-z0-9]/.test(password)
  ){
    score += 10;
  }

  let strengthClass = "";
  if(score < 40){
    strengthClass = "weak";
    feedback = "Weak";
  }else if(score < 60){
    strengthClass = "fair";
    feedback = "Fair";
  }else if(score < 80){
    strengthClass = "good";
    feedback = "Good";
  }else{
    strengthClass = "strong";
    feedback = "Strong";
  }

  strengthFill.className = `strength-fill ${strengthClass}`;
  strengthText.textContent = feedback;
}

async function copyPassword() {
  const password = passwordText.textContent;
  if(password === 'Click "Generate" to create a password'){
    showNotification("Generate a password first", "error")
    return;
  }

  try{
    await navigator.clipboard.writeText(password);
    showNotification("Password copied to clipboard!", "success");
  }catch (err){
    const textArea = document.createElement("textarea");
    textArea.value = password;
    document.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.removeChild(textArea);
    showNotification("Password copied to clipboard!", "success");
  }
}

function showNotification(message, type = 'success'){
  notification.textContent = message;
  notification.style.background = 
  type === "error" ? "rgba(244, 67, 54, 0.9)" : "rgba(76, 175, 80, 0.9)";
  notification.classList.add("show");

  setTimeout(() =>{
    notification.classList.remove("show");
  }, 3000);
}

generateBtn.addEventListener("click", generatePassword);
regenerateBtn.addEventListener("click", generatePassword);
copyBtn.addEventListener("click", copyPassword);

lengthSlider.addEventListener("input", (e) =>{
  options.length = parseInt(e.target.value);
  updateLengthDisplay();
  generatePassword();
});

document.querySelectorAll(".checkbox-item"). forEach(item =>{
  item.addEventListener("click", () =>{
    const option = item.dataset.option;
    toggleOption(option);
    generatePassword();
  })
});

updateLengthDisplay();