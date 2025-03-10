document.addEventListener("DOMContentLoaded", () => {
    // Referencias a elementos del DOM
    const documentTypeRadios = document.getElementsByName("documentType")
    const documentTypeText = document.getElementById("documentTypeText")
    const customerIdLabel = document.getElementById("customerIdLabel")
    const previewDocumentType = document.getElementById("previewDocumentType")
    const documentNumber = document.getElementById("documentNumber")
    const documentDate = document.getElementById("documentDate")
    const productDetails = document.getElementById("productDetails")
  
    // Referencias a campos del formulario
    const customerName = document.getElementById("customerName")
    const customerId = document.getElementById("customerId")
    const customerEmail = document.getElementById("customerEmail")
    const customerPhone = document.getElementById("customerPhone")
    const customerAddress = document.getElementById("customerAddress")
    const customerCity = document.getElementById("customerCity")
    const customerRegion = document.getElementById("customerRegion")
    const paymentMethod = document.getElementById("paymentMethod")
    const deliveryMethod = document.getElementById("deliveryMethod")
  
    // Referencias a elementos de la vista previa
    const previewName = document.getElementById("previewName")
    const previewId = document.getElementById("previewId")
    const previewEmail = document.getElementById("previewEmail")
    const previewPhone = document.getElementById("previewPhone")
    const previewAddress = document.getElementById("previewAddress")
    const previewItems = document.getElementById("previewItems")
    const previewSubtotal = document.getElementById("previewSubtotal")
    const previewTax = document.getElementById("previewTax")
    const previewTotal = document.getElementById("previewTotal")
    const previewPayment = document.getElementById("previewPayment")
    const previewDelivery = document.getElementById("previewDelivery")
  
    // Referencias a botones
    const backButton = document.getElementById("backButton")
    const printButton = document.getElementById("printButton")
  
    // Generar número de documento aleatorio
    const randomNumber = Math.floor(10000 + Math.random() * 90000)
    if (documentNumber) {
      documentNumber.textContent = randomNumber
    }
  
    // Establecer fecha actual
    if (documentDate) {
      const today = new Date()
      const formattedDate = today.toLocaleDateString("es-CL")
      documentDate.textContent = formattedDate
    }
  
    // Cargar producto seleccionado
    let selectedProduct = null
    const storedProduct = localStorage.getItem("selectedProduct")
  
    if (storedProduct) {
      try {
        selectedProduct = JSON.parse(storedProduct)
        displayProductDetails(selectedProduct)
      } catch (error) {
        console.error("Error al cargar el producto:", error)
        displayEmptyProduct()
      }
    } else {
      displayEmptyProduct()
    }
  
    // Función para mostrar detalles del producto
    function displayProductDetails(product) {
      if (!productDetails) return
  
      productDetails.innerHTML = `
              <div class="product-details-grid">
                  <div class="product-details-name">${product.name}</div>
                  <div class="product-details-quantity">
                      <label for="productQuantity">Cantidad:</label>
                      <input type="number" id="productQuantity" min="1" value="${product.quantity}" class="quantity-input">
                  </div>
                  <div class="product-details-price">$${Number.parseFloat(product.price).toFixed(2)}</div>
              </div>
          `
  
      // Agregar evento para actualizar la vista previa cuando cambia la cantidad
      const quantityInput = document.getElementById("productQuantity")
      if (quantityInput) {
        quantityInput.addEventListener("input", function () {
          selectedProduct.quantity = Number.parseInt(this.value) || 1
          updatePreview()
        })
      }
  
      // Actualizar la vista previa
      updatePreview()
    }
  
    // Función para mostrar un producto vacío
    function displayEmptyProduct() {
      if (!productDetails) return
  
      productDetails.innerHTML = `
              <div class="product-details-grid">
                  <div class="product-details-name">No se ha seleccionado ningún producto</div>
                  <div class="product-details-quantity">-</div>
                  <div class="product-details-price">$0.00</div>
              </div>
          `
  
      selectedProduct = {
        id: 0,
        name: "No se ha seleccionado ningún producto",
        price: 0,
        quantity: 0,
      }
  
      updatePreview()
    }
  
    // Cambiar tipo de documento (factura/boleta)
    if (documentTypeRadios) {
      Array.from(documentTypeRadios).forEach((radio) => {
        radio.addEventListener("change", function () {
          const documentType = this.value
  
          // Actualizar texto en el formulario
          if (documentTypeText) {
            documentTypeText.textContent = documentType.charAt(0).toUpperCase() + documentType.slice(1)
          }
  
          // Actualizar etiqueta de ID según tipo de documento
          if (customerIdLabel) {
            customerIdLabel.textContent = documentType === "factura" ? "RUT *" : "DNI *"
          }
  
          // Actualizar título en la vista previa
          if (previewDocumentType) {
            previewDocumentType.textContent = documentType.toUpperCase()
          }
  
          updatePreview()
        })
      })
    }
  
    // Agregar eventos a los campos del formulario para actualizar la vista previa
    const formFields = [
      customerName,
      customerId,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      customerRegion,
      paymentMethod,
      deliveryMethod,
    ]
  
    formFields.forEach((field) => {
      if (field) {
        field.addEventListener("input", updatePreview)
        field.addEventListener("change", updatePreview)
      }
    })
  
    // Función para actualizar la vista previa
    function updatePreview() {
      // Actualizar datos del cliente
      if (previewName && customerName) {
        previewName.textContent = customerName.value || "Nombre del Cliente"
      }
  
      if (previewId && customerId) {
        const documentType = document.querySelector('input[name="documentType"]:checked')?.value || "factura"
        const idLabel = documentType === "factura" ? "RUT" : "DNI"
        previewId.textContent = customerId.value ? `${idLabel}: ${customerId.value}` : ""
      }
  
      if (previewEmail && customerEmail) {
        previewEmail.textContent = customerEmail.value || ""
      }
  
      if (previewPhone && customerPhone) {
        previewPhone.textContent = customerPhone.value || ""
      }
  
      if (previewAddress) {
        let address = ""
  
        if (customerAddress && customerAddress.value) {
          address += customerAddress.value
        }
  
        if (customerCity && customerCity.value) {
          address += address ? `, ${customerCity.value}` : customerCity.value
        }
  
        if (customerRegion && customerRegion.value) {
          address += address ? `, ${customerRegion.value}` : customerRegion.value
        }
  
        previewAddress.textContent = address
      }
  
      // Actualizar método de pago y entrega
      if (previewPayment && paymentMethod) {
        previewPayment.textContent = paymentMethod.value || "-"
      }
  
      if (previewDelivery && deliveryMethod) {
        previewDelivery.textContent = deliveryMethod.value || "-"
      }
  
      // Actualizar tabla de productos
      if (previewItems && selectedProduct) {
        const quantity = document.getElementById("productQuantity")?.value || selectedProduct.quantity || 1
        const price = Number.parseFloat(selectedProduct.price)
        const total = quantity * price
  
        previewItems.innerHTML = `
                  <tr>
                      <td>${selectedProduct.name}</td>
                      <td class="text-center">${quantity}</td>
                      <td class="text-center">$${price.toFixed(2)}</td>
                      <td class="text-right">$${total.toFixed(2)}</td>
                  </tr>
              `
  
        // Actualizar totales
        const subtotal = total
        const tax = subtotal * 0.19 // 19% IVA
        const grandTotal = subtotal + tax
  
        if (previewSubtotal) previewSubtotal.textContent = `$${subtotal.toFixed(2)}`
        if (previewTax) previewTax.textContent = `$${tax.toFixed(2)}`
        if (previewTotal) previewTotal.textContent = `$${grandTotal.toFixed(2)}`
      }
    }
  
    // Validar formulario
    function validateForm() {
      const requiredFields = document.querySelectorAll("[required]")
      let isValid = true
  
      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          field.classList.add("invalid")
          isValid = false
        } else {
          field.classList.remove("invalid")
        }
      })
  
      return isValid
    }
  
    // Eventos de botones
    if (backButton) {
      backButton.addEventListener("click", () => {
        window.location.href = "index.html"
      })
    }
  
    if (printButton) {
      printButton.addEventListener("click", () => {
        if (validateForm()) {
          window.print()
        } else {
          alert("Por favor complete todos los campos obligatorios antes de imprimir.")
        }
      })
    }
  
    // Inicializar la vista previa
    updatePreview()
  })