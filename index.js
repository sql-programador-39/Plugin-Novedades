import { css } from './styles.css.js';

class FormNovedades extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    document.addEventListener('obtenerData', e => {
      const respuesta = e.detail;
      this.addOptions(respuesta);
      this.configurarEventos(respuesta);
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${css}
      </style>
      
      <form id="form-novedad" onsubmit="this.handleSubmit">

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
          <option value="Nómina">Nómina</option>
          <option value="Taquilla">Taquilla</option>
        </select>
        
      </div>

      <button type="submit" id="submit-button">Crear Convenio</button>
      </form>
    `;
  }

  // Eventos que se ejecutan despues del renderizado del componente

  async configurarEventos(respuesta) {
    const data = respuesta;
    this.shadowRoot.querySelector('#convenio').addEventListener('change', (e) => this.handleConvenioChange(e, data));
    this.shadowRoot.querySelector('#form-novedad').addEventListener('submit', (e) => this.handleSubmit(e, data));
  }

  // Metodo para agregar las opciones al select de convenios

  addOptions(data) {
    
    if(!data) return;
    
    const convenio = this.shadowRoot.querySelector('#convenio');
    const option = document.createElement('option');
    option.value = '0';
    option.textContent = '--Seleccionar convenio--';
    convenio.appendChild(option);

    Object.keys(data).forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = key;
      convenio.appendChild(option);
    });
  }

  // Funcion para obtener los datos de un convenio cuando este se haya seleccionado en 
  
  handleConvenioChange(e, data) {

    const cuotaMensual = this.shadowRoot.querySelector('#cuotaMensual');
    const plazoMensual = this.shadowRoot.querySelector('#plazoMensual');
    const formaPago = this.shadowRoot.querySelector('#formaPago');
    const saldoTotal = this.shadowRoot.querySelector('#saldoTotal');
    let tipoNovedad = "";
    cuotaMensual.value = '';
    formaPago.value = '0';

    //Llenar el campo de fecha limite segun el convenio seleccionado
    
    const fechaLimite = this.shadowRoot.querySelector('#fecha-limite');
    Object.keys(data).forEach(key => {
      if(key === e.target.value) {
        fechaLimite.innerText = data[key][0].FechaLimite;
      }
    })

    if(plazoMensual) {
      saldoTotal.innerText = '0.00';
      plazoMensual.value = '';
    }

    // Metodo para obtener el valor de la cuota mensual segun el convenio seleccionado

    Object.keys(data).forEach(key => {
      if(key === e.target.value) {
        cuotaMensual.value = '$ ' + this.addPoints(data[key][0].Cuota) + ' COP';
        tipoNovedad = data[key][0].TipoNovedad;
      }
    });

    //Segun el tipo de novedad se muestran los campos adicionales, plazo mensual y saldo total

    if(tipoNovedad === "novedad varia no causada con saldo" || tipoNovedad === "novedad varia causada con saldo") {
      this.renderInfo();
      this.calcSaldo();
    } else {
      const existingPlazoMensual = this.shadowRoot.getElementById('plazoMensual');
      const existingSaldoTotal = this.shadowRoot.getElementById('div-total');
      const existingLabelPlazo = this.shadowRoot.getElementById('label-plazo');

      if(existingPlazoMensual) {
        existingPlazoMensual.value = '';
        existingPlazoMensual.remove();
        existingSaldoTotal.remove();
        existingLabelPlazo.remove();
      }
    }
  }

  // Metodo para renderizar los campos adicionales, plazo mensual y saldo total, pero solo se renderizan si el tipo de novedad es "novedad varia no causada con saldo" o "novedad varia causada con saldo"

  renderInfo() {
    const existingPlazoMensual = this.shadowRoot.getElementById('plazoMensual');
    const formaPago = this.shadowRoot.getElementById('formaPago');
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
        formaPago.insertAdjacentHTML('afterend', plazoSaldo);
      }
  }

  // Metodo para calcular el saldo total segun el plazo mensual y la cuota mensual, tambien se agrega la funcion para agregar comas a los numeros

  calcSaldo() {

    const plazoMensual = this.shadowRoot.getElementById('plazoMensual');
    const saldoTotal = this.shadowRoot.getElementById('saldoTotal');
    const cuotaMensual = this.shadowRoot.getElementById('cuotaMensual');


    if(plazoMensual) {

      plazoMensual?.addEventListener('input', () => {
        const cuotaMensualValue = cuotaMensual.value;
        const numeroCuota = parseFloat(cuotaMensualValue.replace(/[^0-9]/g, ''));
        const plazoMensualValue = plazoMensual.value;

        if(numeroCuota !== '') {
          let saldo = plazoMensualValue * numeroCuota;
          saldo = this.addPoints(saldo);
          saldoTotal.innerText = '$ ' + saldo + ' COP';
        }
      });

      cuotaMensual.addEventListener('input', () => {
        const cuotaMensualValue = cuotaMensual.value;
        const numeroCuota = parseFloat(cuotaMensualValue.replace(/[^0-9]/g, ''));
        const plazoMensualValue = plazoMensual.value;

        if(plazoMensualValue !== '') {
          let saldo = plazoMensualValue * numeroCuota;
          saldo = this.addPoints(saldo);
          saldoTotal.innerText = '$ ' + saldo;
        }
      });
    }
  }

  //Funcion para agregar comas a los numeros

  addPoints(nStr) {
    nStr += '';
    let x = nStr.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
  }

  // Metodo para enviar los datos del formulario

  handleSubmit(e, data) {
    e.preventDefault();

    const submitButton = this.shadowRoot.getElementById('submit-button');
    const selectors = {
      convenio: this.shadowRoot.getElementById('convenio').value,
      cuotaMensual: this.shadowRoot.getElementById('cuotaMensual').value,
      formaPago: this.shadowRoot.getElementById('formaPago').value,
      plazoMensual: this.shadowRoot.getElementById('plazoMensual')?.value,
      saldoTotal: this.shadowRoot.getElementById('saldoTotal')?.innerText
    }

    const convenio = selectors.convenio;
    const cuotaMensual = selectors.cuotaMensual.replace(/[^0-9]/g, '');
    const formaPago = selectors.formaPago;
    const plazoMensual = selectors?.plazoMensual;
    const saldoTotal = selectors.saldoTotal?.replace(/[^0-9]/g, '');

    //Validar que los campos no esten vacios y que el convenio y la forma de pago sean diferentes de 0

    if([convenio, cuotaMensual, formaPago, plazoMensual, saldoTotal].includes('')) {
        this.showAlert('Todos los campos son requeridos', submitButton);
      return;
    }

    if(convenio === '0') {
      this.showAlert('Por favor seleccione un convenio', submitButton);
      return;
    }

    if(formaPago === '0') {
      this.showAlert('Por favor seleccione una forma de pago', submitButton);
      return;
    }

    //Crear el objeto con los datos del formulario

    const formData = {
      convenio,
      cuotaMensual,
      formaPago,
      plazoMensual,
      saldoTotal
    };

    // validar fecha limite para crear la novedad

    Object.keys(data).forEach(key => {
      if(key === this.shadowRoot.getElementById('convenio').value) {
        const fechaLimite = data[key][0].FechaLimite;
        const fechaLimiteW = new Date(fechaLimite);
        const fechaLimiteW2 = new Date(fechaLimiteW.getFullYear(), fechaLimiteW.getMonth(), fechaLimiteW.getDate());
        const fechaActual = new Date();
        const fechaActualW = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());

        if(fechaLimiteW2 < fechaActualW) {
          this.showAlert('La fecha limite para crear la novedad ya se cumplio.', this.shadowRoot.getElementById('submit-button'));
          return
        } else {
          const event = new CustomEvent('formularioSubmit', {
            detail: formData
          });
          document.dispatchEvent(event);
        }
      }
    });
  }

  // Funcion para mostrar una alerta en el formulario

  showAlert(msg, targetElement) {
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert');
    const alertP = document.createElement('p');
    const text = msg;
    alertP.innerText = text;
    alertDiv.appendChild(alertP);

    targetElement.parentNode.insertBefore(alertDiv, targetElement);

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
  }
}


customElements.define('form-novedades', FormNovedades)
