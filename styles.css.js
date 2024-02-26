export const css = `
:host {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 97vh;
}

form {
  width: 60%;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #0e4380;
  font-size: 1.5em;
  margin-bottom: 10px;
  text-align: center;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: 700;
}

input, select {
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  border-radius: 5px;
  outline: none;
  border: 1px solid #ccc;
  font-family: Arial, sans-serif;
}

input:focus, select:focus {
  outline: none;
  border: 2px solid #0e4380;
}

div {
  width: 50%;
  margin: 15px auto;
}

button {
  padding: 10px;
  width: 20%;
  background-color: #0e4380;
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  margin: 0 auto;
}

button:hover {
  transform: translateY(-2px);
  transition: 0.5s;
}

.alert {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px 0;
  margin-bottom: 10px;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
  text-align: center;
  font-weight: 600;
}

.false-input{
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  margin-top: 0;
  border-radius: 5px;
}

.number::-webkit-inner-spin-button,
#miInputNumerico::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.number {
    -moz-appearance: textfield;
}

.div-saldo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 10px 0;
  padding-top: 10px;
  border-top: 1px solid #ccc;
}

.div-fecha {
  width: 100%;
  margin: 0 0 10px 0;
}

.div-fecha p:first-child {
  font-weight: 700;
  margin: 0;
  margin-bottom: 10px;
}

.p-fecha {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  margin: 0 0 10px 0;
}

.div-saldo p{
  font-weight: 700;
  margin: 0;
}

@media screen and (max-width: 768px){
  form {
    width: 90%;
  }

  div {
    width: 100%;
  }

  button {
    width: 40%;
  }
}

@media (min-width: 768px) and (max-width: 1300px){
  form {
    width: 60%;
  }

  div {
    width: 70%;
  }

  button {
    width: 30%;
  }
}
`