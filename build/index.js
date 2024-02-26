(() => {
  // styles.css.js
  var css = `
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
`;

  // index.js
  var FormNovedades = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
      this.configurarEventos();
    }
    render() {
      this.shadowRoot.innerHTML = `
      <style>
        ${css}
      </style>
      
      <form id="form-novedad">

      <h1>Crear Novedades</h1>

      <div>

        <label for="convenio">Convenio *</label>
        <select 
          id="convenio" 
          name="convenio"
          placeholder="Nombre del convenio" 
        >
        </select>

        <div class="div-fecha">
          <p>Fecha limite para crear esta novedad:</p>
          <p class="p-fecha" id="fecha-limite">YYYY-MM-DD</p>
        </div>

        <label for="cuotaMensual">Cuota Mensual *</label>
        <input 
          type="text" 
          id="cuotaMensual" 
          name="cuotaMensual" 
          placeholder="Cuota mensual"
          class="number"
        />

        <label for="formaPago">Forma de pago *</label>
        <select 
          id="formaPago" 
          name="formaPago"
          placeholder="Forma de pago"
        >
          <option value="0">--Seleccionar forma de pago--</option>
          <option value="N\xF3mina">N\xF3mina</option>
          <option value="Taquilla">Taquilla</option>
        </select>
        
      </div>

      <button type="submit" id="submit-button">Crear Convenio</button>
      </form>
    `;
    }
    // Eventos que se ejecutan despues del renderizado del componente
    async configurarEventos() {
      const data = await this.getData();
      this.addOptions(data);
      this.shadowRoot.querySelector("#convenio").addEventListener("change", (e) => this.handleConvenioChange(e, data));
      this.shadowRoot.querySelector("#submit-button").addEventListener("click", (e) => this.handleSubmit(e, data));
    }
    // Metodo para obtener los datos de los convenios
    async getData() {
      const url2 = "./data.json";
      try {
        const respuesta = await fetch(url2);
        const datos = await respuesta.json();
        if (respuesta.ok) {
          return datos;
        } else {
          throw new Error("Error en la peticion");
        }
      } catch (error) {
        this.showAlert("No se pudieron consultar los covenios", this.shadowRoot.getElementById("submit-button"));
      }
    }
    // Metodo para agregar las opciones al select de convenios
    addOptions(data) {
      if (!data)
        return;
      const convenio = this.shadowRoot.querySelector("#convenio");
      const option = document.createElement("option");
      option.value = "0";
      option.textContent = "--Seleccionar convenio--";
      convenio.appendChild(option);
      Object.keys(data).forEach((key) => {
        const option2 = document.createElement("option");
        option2.value = key;
        option2.textContent = key;
        convenio.appendChild(option2);
      });
    }
    // Funcion para obtener los datos de un convenio cuando este se haya seleccionado en 
    handleConvenioChange(e, data) {
      const cuotaMensual = this.shadowRoot.querySelector("#cuotaMensual");
      const plazoMensual = this.shadowRoot.querySelector("#plazoMensual");
      const formaPago = this.shadowRoot.querySelector("#formaPago");
      const saldoTotal = this.shadowRoot.querySelector("#saldoTotal");
      let tipoNovedad = "";
      cuotaMensual.value = "";
      formaPago.value = "0";
      const fechaLimite = this.shadowRoot.querySelector("#fecha-limite");
      Object.keys(data).forEach((key) => {
        if (key === e.target.value) {
          fechaLimite.innerText = data[key][0].FechaLimite;
        }
      });
      if (plazoMensual) {
        saldoTotal.innerText = "0.00";
        plazoMensual.value = "";
      }
      Object.keys(data).forEach((key) => {
        if (key === e.target.value) {
          cuotaMensual.value = "$ " + this.addPoints(data[key][0].Cuota) + " COP";
          tipoNovedad = data[key][0].TipoNovedad;
        }
      });
      if (tipoNovedad === "novedad varia no causada con saldo" || tipoNovedad === "novedad varia causada con saldo") {
        this.renderInfo();
        this.calcSaldo();
      } else {
        const existingPlazoMensual = this.shadowRoot.getElementById("plazoMensual");
        const existingSaldoTotal = this.shadowRoot.getElementById("div-total");
        const existingLabelPlazo = this.shadowRoot.getElementById("label-plazo");
        if (existingPlazoMensual) {
          existingPlazoMensual.value = "";
          existingPlazoMensual.remove();
          existingSaldoTotal.remove();
          existingLabelPlazo.remove();
        }
      }
    }
    // Metodo para renderizar los campos adicionales, plazo mensual y saldo total, pero solo se renderizan si el tipo de novedad es "novedad varia no causada con saldo" o "novedad varia causada con saldo"
    renderInfo() {
      const existingPlazoMensual = this.shadowRoot.getElementById("plazoMensual");
      const formaPago = this.shadowRoot.getElementById("formaPago");
      const plazoSaldo = `
        <label for="plazoMensual" id="label-plazo">Plazo Mensual *</label>
        <input 
          type="number" 
          id="plazoMensual" 
          name="plazoMensual" 
          placeholder="Plazo mensual"
          class="number"
        />

        <div class="div-saldo" id="div-total">
          <p id="saldoTotalLabel">Saldo Total:</p>
          <p id="saldoTotal">$ 0.00 COP</p>
        </div>
      `;
      if (!existingPlazoMensual) {
        formaPago.insertAdjacentHTML("afterend", plazoSaldo);
      }
    }
    // Metodo para calcular el saldo total segun el plazo mensual y la cuota mensual, tambien se agrega la funcion para agregar comas a los numeros
    calcSaldo() {
      const plazoMensual = this.shadowRoot.getElementById("plazoMensual");
      const saldoTotal = this.shadowRoot.getElementById("saldoTotal");
      const cuotaMensual = this.shadowRoot.getElementById("cuotaMensual");
      if (plazoMensual) {
        plazoMensual?.addEventListener("input", () => {
          const cuotaMensualValue = cuotaMensual.value;
          const numeroCuota = parseFloat(cuotaMensualValue.replace(/[^0-9]/g, ""));
          const plazoMensualValue = plazoMensual.value;
          if (numeroCuota !== "") {
            let saldo = plazoMensualValue * numeroCuota;
            saldo = this.addPoints(saldo);
            saldoTotal.innerText = "$ " + saldo + " COP";
          }
        });
        cuotaMensual.addEventListener("input", () => {
          const cuotaMensualValue = cuotaMensual.value;
          const numeroCuota = parseFloat(cuotaMensualValue.replace(/[^0-9]/g, ""));
          const plazoMensualValue = plazoMensual.value;
          if (plazoMensualValue !== "") {
            let saldo = plazoMensualValue * numeroCuota;
            saldo = this.addPoints(saldo);
            saldoTotal.innerText = "$ " + saldo;
          }
        });
      }
    }
    //Funcion para agregar comas a los numeros
    addPoints(nStr) {
      nStr += "";
      let x = nStr.split(".");
      let x1 = x[0];
      let x2 = x.length > 1 ? "." + x[1] : "";
      let rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1.$2");
      }
      return x1 + x2;
    }
    // Metodo para enviar los datos del formulario
    handleSubmit(e, data) {
      e.preventDefault();
      const submitButton2 = this.shadowRoot.getElementById("submit-button");
      const selectors = {
        convenio: this.shadowRoot.getElementById("convenio").value,
        cuotaMensual: this.shadowRoot.getElementById("cuotaMensual").value,
        formaPago: this.shadowRoot.getElementById("formaPago").value,
        plazoMensual: this.shadowRoot.getElementById("plazoMensual")?.value,
        saldoTotal: this.shadowRoot.getElementById("saldoTotal")?.innerText
      };
      const convenio = selectors.convenio;
      const cuotaMensual = selectors.cuotaMensual.replace(/[^0-9]/g, "");
      const formaPago = selectors.formaPago;
      const plazoMensual = selectors?.plazoMensual;
      const saldoTotal = selectors.saldoTotal?.replace(/[^0-9]/g, "");
      if ([convenio, cuotaMensual, formaPago, plazoMensual, saldoTotal].includes("")) {
        this.showAlert("Todos los campos son requeridos", submitButton2);
        return;
      }
      if (convenio === "0") {
        this.showAlert("Por favor seleccione un convenio", submitButton2);
        return;
      }
      if (formaPago === "0") {
        this.showAlert("Por favor seleccione una forma de pago", submitButton2);
        return;
      }
      const formData = {
        convenio,
        cuotaMensual,
        formaPago,
        plazoMensual,
        saldoTotal,
        documento: this.getAttribute("data-documento"),
        url: this.getAttribute("data-url"),
        ruta: this.getAttribute("data-ruta")
      };
      Object.keys(data).forEach((key) => {
        if (key === this.shadowRoot.getElementById("convenio").value) {
          const fechaLimite = data[key][0].FechaLimite;
          const fechaLimiteW = new Date(fechaLimite);
          const fechaLimiteW2 = new Date(fechaLimiteW.getFullYear(), fechaLimiteW.getMonth(), fechaLimiteW.getDate());
          const fechaActual = /* @__PURE__ */ new Date();
          const fechaActualW = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
          if (fechaLimiteW2 < fechaActualW) {
            this.showAlert("La fecha limite para crear la novedad ya se cumplio.", this.shadowRoot.getElementById("submit-button"));
            return;
          } else {
            console.log(JSON.stringify(formData));
          }
        }
      });
    }
    // Funcion que se conecta al servicio y manda una peticion de tipo POST con los datos del formulario
    async sendData(formData) {
      url = "https://jsonplaceholder.typicode.com/posts";
      await fetch(url, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then((response2) => response2.json());
      if (response.ok) {
        this.showAlert("Novedad creada con exito", submitButton);
      } else {
        this.showAlert("Error al crear la novedad", submitButton);
      }
    }
    // Funcion para mostrar una alerta en el formulario
    showAlert(msg, targetElement) {
      const alertDiv = document.createElement("div");
      alertDiv.classList.add("alert");
      const alertP = document.createElement("p");
      const text = msg;
      alertP.innerText = text;
      alertDiv.appendChild(alertP);
      targetElement.parentNode.insertBefore(alertDiv, targetElement);
      setTimeout(() => {
        alertDiv.remove();
      }, 3e3);
    }
  };
  customElements.define("form-novedades", FormNovedades);
})();
