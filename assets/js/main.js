$(document).ready(function(){
    const srcPath = 'assets/img/';
  
    asynFunctionCallsGlobal();
    let CLOTHES;
   // let SORT;
    let SIZES;

    async function getData(endpoint) {
      const asynPath = 'assets/data/';
      try {
          let response = await fetch(asynPath + endpoint);
          if (!response.ok) {
              throw new Error('Network response was not ok.');
          }
          let data = await response.json();
          return data;
      } catch (error) {
          alert('Error fetching data:', error);
          return null; 
      }
  }
  async function asynFunctionCallsGlobal() {
      let menu = await getData('menu.json');
      let footer = await getData('footer.json');
      let sizes = await getData('sizes.json');
      let clothes = await getData('clothes.json');   
      CLOTHES = clothes;
      SIZES = sizes;
      displayMenu(menu, '#navbarSupportedContent');
      displayFooter(footer);
      displayMenu(menu, "#menu");
      setLocalStorage("allProducts", clothes);
     
  }
  async function asynFunctionCallIndex() {
    let benefits = await getData('benefits.json');
    let clothes = await getData('clothes.json');
    let customers = await getData('customers.json');
    let sizes = await getData('sizes.json');
    SIZES = sizes;
      displayBenefits(benefits, '#benefits', 'block-benefits');
      displayNewArrival(clothes);
      displayMostPopular(clothes);
      displayBenefits(benefits, '#benefitsSecond', 'block-benefits-second');
      displayCustomers(customers);
  }
  
  async function asynFunctionCallShop() {
    let categories = await getData('categories.json');
    let sizes = await getData('sizes.json');
    let  clothes = await getData('clothes.json');
    let sort = await getData('sort.json');
      CLOTHES = clothes;
      SORT = sort;
      displayDropDownForSorting(sort);
      displayFilterItems('Category', categories);
      displayFilterItems('Size', sizes);
      displayProducts(clothes, '#allProducts');
  }
  async function asynFunctionCallCart(){
    let orders = await getData('orders.json');

    displayOrderTypes(orders);

    
  }

    function displayMenu(data, element){
        let display = '<ul class="navbar-nav me-auto mb-2 mb-lg-0">';
        for(let item of data){
            display+=`<li class="nav-item">
            <a class="nav-link" href="${item.href}">${item.title}</a>
          </li>`
        }
        display+='</ul>';
        $(element).html(display);
    }
    function displayProducts(product, element){
        let display='';
        product.forEach(x=>{
            let id= x.src.substring(0,x.src.indexOf('.'));
            display+= `<div class="card item position-relative" style="width: 18rem;"><div data-bs-toggle="modal" data-bs-target="#${id}">
            ${isNewIn(x)}
            <img src="${srcPath}${x.src}" alt="${id}" class="card-img-top" alt="${x.description}">          
          </div>
          <div class="card-body">
          ${isOrganicCotton(x)}
          ${processPrice(x)}
          <p class="mb-0">${processStars(x)}</p>
           <button class="add-to-cart" data-product="${x.id}">ADD TO CART</button>
           <p class="card-text mt-1">${x.description}</p>
          </div>           
          </div>
          <div class="modal fade" id="${id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5 dark-green" id="exampleModalLabel">${x.description}</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <img src="${srcPath}${x.src}" alt="${id}" class="img-fluid"> <br>
                  <div class="row">
                    <div class="col-6">
                      <p class="mb-1">Sizes:</p>
                      ${processSizes(x.sizes)}
                      </div>
                      <div class="col-6 text-end">
                        <p>Price:</p>
                        ${processPrice(x)}
                    </div>
                  </div>
                </div>
                <div class="modal-footer">     
                  <button type="button" class="btn add-to-cart" data-product="${x.id}">Add To Cart</button>
                </div>
              </div>
            </div>
          </div>`
        });
        //console.log(display);
        $(element).html(display);

    }
    function isNewIn(product){
        if(product.new){
            return `<div class="position-absolute new-in">
                        <p>New In</p>
                    </div>`
        }
        return '';
    }
    function isOrganicCotton(product){
        if(product.cotton){
            return `<p class="mb-0 text-body-tertiary">Organic Cotton</p>`
        }
        return '<p class="mb-0 mt-4"></p>';
    }
    function processPrice(product){
        if(product.price.old === undefined){
            return `<p class="fw-bold mb-1">&dollar;${product.price.new}</p>`
        }
        return `<p class="fw-bold mb-1"><del>&dollar;${product.price.old}</del><span class="ms-1 text-danger">&dollar;${product.price.new}</span></p>`
    }
    function processStars(product){
        let display='';
        for(let i=0; i<product.stars; i++){
            display+='<span class="dark-green fs-5">&starf;</span>';
        }
        return display;
    }
    function processSizes(sizes){
      let display = '';
      sizes.forEach(sizeId => {
          let sizeName = SIZES.find(size => size.id === sizeId).name;
          if (sizeName) {
              display += `<p class="mb-0 dark-green">${sizeName}</p>`;
          }
      });
      return display;
    }
    function displayFooter(data){
        let display=`<section class="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">    
        <div class="me-5 d-none d-lg-block">
          <span>Get connected with us on social networks:</span>
        </div>
        <div>`;
        data.social.forEach(x=>{
           
            display+=` <a href="${x.href}" target="_blank" class="me-4 text-reset">
            <i class="${x.icon}"></i>
          </a>`         
        });
        display+=`
        </div>
      </section>
      <section>
        <div class="container text-center text-md-start mt-5">
          <div class="row mt-3">
            <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              <h1><a class="navbar-brand fs-4 logo" href="#">Bambino</a></h1>   
              <p>
                Explore our delightful collection of baby clothing, designed for comfort and cuteness.
              </p>
            </div>
            <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 class="text-uppercase fw-bold mb-4">
                Products
              </h6>`;
        data.products.forEach(x=>{
            display+=` <p class="text-reset">${x}</p>`;
        });
        display+= `</div>
        <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
          <h6 class="text-uppercase fw-bold mb-4">
            Useful links
          </h6>
          <div id="menu">
          </div>
        </div>
        <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
          <h6 class="text-uppercase fw-bold mb-4">Contact</h6>`;
        data.contact.forEach(x=>{
            display+=`<p><i class="${x.icon}"></i>${x.text}</p>`
        });
        display+=`</div>
        </section>
        <div class="text-center p-4" style="background-color: rgba(0, 0, 0, 0.05);">
        <p class="mb-0"><a href="documentation.pdf" class="text-dark">Documentation</a></p>
        <p>© ${currentYear()} Copyright: <span class="fw-bold">Bambino</span></p>
          
          
        </div>`;
        $('footer').html(display);
    }

    function currentYear(){
        let date= new Date();
        console.log(date.getFullYear())
        return date.getFullYear();
    }

  //KORPA!!!!!!!!!!!!!!!!!
  //Functions for CART
  function setLocalStorage(name, data){
    localStorage.setItem(name, JSON.stringify(data));
  }
  function getFromLocalStorage(name){
    return JSON.parse(localStorage.getItem(name));
  }
  function displayTotalPrice(){
    let productsInLS = getFromLocalStorage('cart');
    let sum = 0;

    if(productsInLS){
      
      productsInLS.forEach(x=>{
        let price = Number(x.price);
        sum+= price;
  
      })
      sum = sum.toFixed(2);
    }  
    let spanPrice = `$${sum}`;
    
    $('#sumPrice').html(spanPrice);
    return spanPrice;
  }
 
  function displayNumberOfProducts(){
    let productsInCart = getFromLocalStorage('cart');
    let productsNumber = 0;

    if(productsInCart){
      productsNumber = productsInCart.length;       
    }
    $('#number').html(productsNumber);
  }

  displayTotalPrice();
  displayNumberOfProducts();

//ADD TO CART
    $(document).on('click', '.add-to-cart', function() {
     
      let productId = $(this).data('product');
      //console.log(productId)
      addToCart(productId);
  });

  function addToCart(productId){
    let allProducts = getFromLocalStorage('allProducts');  
    let productsInCart = getFromLocalStorage('cart');
    let productPrice = allProducts.find(p=>p.id==productId).price.new;
    productPrice = productPrice.toFixed(2);
    
    //cart is not empty
    if(productsInCart){
      if(productAlreadyInCart()){
          updateQuantity();
      }else{

        addNewProductInCart();
        displayNumberOfProducts();
      }
    }else{
      addFirstProductInCart();
      displayNumberOfProducts();
    }

    // FUNCTIONS
    function addFirstProductInCart(){
      let products=[];
      
      products[0] = {
        id: productId,
        qty: 1,
        price: productPrice
      }
      setLocalStorage('cart', products);
      displayTotalPrice();
    }
    function productAlreadyInCart(){
      return productsInCart.filter(p=>p.id==productId).length;
    }
    function updateQuantity(){
      let productsInLS = getFromLocalStorage('cart');
      let productPrice = allProducts.find(p=>p.id==productId).price.new;
      
      for(let product of productsInLS){
        if(product.id == productId){
          product.qty++;
          price = product.qty * productPrice;
          price = price.toFixed(2);
          product.price = price;
          break;
        }
      }

      setLocalStorage('cart', productsInLS);
      displayTotalPrice();

    }
    function addNewProductInCart(){
      let productsInLS = getFromLocalStorage('cart');

      productsInLS.push({
        id:productId,
        qty: 1,
        price: productPrice
      })
      setLocalStorage('cart', productsInLS);
      displayTotalPrice();
    }

    
  }
//Index.html
    let url = window.location.pathname;
    if (url == "/bambino/" || url.includes("index.html")){
    // if (url === '/sajt/' || url.includes('index.html')){
      asynFunctionCallIndex();
     
        displayCarousel();
        function displayCarousel(){
            let coverSrc = ['clothes-cover.jpg', 'mum-cover.jpg', 'shoes-cover.jpg'];
            let coverAlt = ['Baby clothes', 'Pregnant women', 'Shoes'];

            let carouselInner = document.querySelector('.carousel-inner');

            //Append before this child
            let firstCarouselItem = carouselInner.firstChild;
 
            coverSrc.forEach((src, index) => {
       
            let carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');
        
            if (index === 0) {
                carouselItem.classList.add('active');
            }
            
            let img = document.createElement('img');
            img.src = srcPath + src; 
            img.classList.add('d-block', 'w-100');
            img.alt = coverAlt[index]; 

            carouselItem.appendChild(img);
            carouselInner.insertBefore(carouselItem, firstCarouselItem);
            });       
        }
        
        function displayBenefits(data,element, style){
            let display= '';
            for(let benefit of data){
                display+=`<div class="${style} text-center rounded">
                <p class="mb-1"><i class="${benefit.icon}"></i></p>
                <h5 class="mb-1">${benefit.title}</h5>
                <p class="mb-1">${benefit.description}</p>
              </div>`
            }
            $(element).html(display);
        }

        function displayNewArrival(data){
            //Display first 4 new Arrivals
            let newData = data.filter(x => x.new).slice(0, 4);
            
            displayProducts(newData, '#new-arrival')
        }

        //Toggle
        function toggleReadMore(button, text) {
            $(`${button}`).click(function () {
                $(`${text}`).slideToggle('slow');
                if ($(`${button}`).text() === "Read More") {
                    $(this).text("Read Less");
                    $(this).removeClass("readMore");
                  //  $(this).addClass("readLess");
                }
                else {
                    $(this).text("Read More");
                   // $(this).removeClass("readLess");
                    $(this).addClass("readMore");
                }
            }
            );
        }
        toggleReadMore('#readMore', '#hiddenMainP');
        
        function displayMostPopular(data){
            //First 4 most popular
            let newData = data.sort(function(a,b){
                return b.stars-a.stars;
            }).slice(0, 4);
            displayProducts(newData, '#mostLoved');
        }
        function displayCustomers(data){
            let display = '';
            data.forEach(x=>{
              //console.log(x.src)
                display+=`<div class="customer text-center col-5">
                <img src="${srcPath}${x.img}" alt="${x.name}" class="rounded-circle shadow mb-2"/>
                <p><i class="fa-solid fa-quote-left fs-3 text-body-tertiary"></i></p>
                <p class="fs-5 yellow-text mb-0">${x.name}</p>
                <p class="fs-5 dark-green">${processStars(x.stars)}</p>
                <p class="fst-italic">"${x.comment}"</p>
              </div>`
            });
            //console.log(display);
            $('#customers').html(display);
        }    
    }
        //End index.html
    // shop.html
    if(url.includes('shop.html')){
      asynFunctionCallShop();
      function displayFilterItems(title, object){
                let container = document.createElement('form');
                container.innerHTML = `<h5>${title}</h5>`;
            
                object.forEach(item => {
                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
               
                checkbox.id = `${item.id}`;

                let label = document.createElement('label');
                label.htmlFor = `${item.id}`;
                label.classList.add('ms-2');
                label.appendChild(document.createTextNode(item.name));

                let div = document.createElement('div');
                div.appendChild(checkbox);
                div.appendChild(label);

                container.appendChild(div);
            });
            $('#filterItems').append(container);           
      }
     function displayDropDownForSorting(data){
      display = `<option value="0">Default sorting</option>`;

      data.forEach(x=>{
        display+=`<option value="${x.id}">${x.sorting}</option>`;
      })
      $('#sort').html(display);
     }

     function sortProducts(property, order) {

      let products = CLOTHES;

      if(property == 'price'){
        products.sort(function (el1, el2) {
          if (order === 'asc') {
            if (el1.price.new > el2.price.new) {
                return 1;
            }
            if (el1.price.new < el2.price.new) {
                return -1;
            }
            return 0;
        } else if (order === 'desc') {
            if (el1.price.new < el2.price.new) {
                return 1;
            }
            if (el1.price.new > el2.price.new) {
                return -1;
            }
            return 0;
        }
      });
      }else{
        products.sort(function (el1, el2) {
          if (order === 'asc') {
              if (el1[property] > el2[property]) {
                  return 1;
              }
              if (el1[property] < el2[property]) {
                  return -1;
              }
              return 0;
          } else if (order === 'desc') {
              if (el1[property] < el2[property]) {
                  return 1;
              }
              if (el1[property] > el2[property]) {
                  return -1;
              }
              return 0;
          }
      });
    
      }
      displayProducts(products, '#allProducts'); 
  }
  //Selecting
    $(document).on('change', '#sort', function(){

      let sortValue = $('#sort option:selected').index();
           
      if(sortValue == 0){
        displayProducts(CLOTHES,'#allProducts');       
      }
      else {
        switch (sortValue) {
            case 1:
                sortProducts('price', 'asc');
                break;
            case 2:
                sortProducts('price', 'desc');
                break;
            case 3:
                sortProducts('stars', 'desc');
                break;
            case 4:
                sortProducts('description', 'asc');
                break;
            case 5:
                sortProducts('description', 'desc');
                break;
            default:
                break;
        }
    }
    })

    //Search
    $('#search').on('input', function() {
      let searchText = $(this).val().toLowerCase(); 
      
      let filteredProducts = CLOTHES.filter(function(product) {
          return product.description.toLowerCase().includes(searchText); 
      });
      if (filteredProducts.length > 0) {
        displayProducts(filteredProducts, '#allProducts');
    } else {
        
        $('#allProducts').html('<p class="fw-bold">No products found.</p>');
    }    
    });
    //Filter
    $('#filterItems').on('change', 'input[type="checkbox"]', function() {
      let selectedCategories = [];
      let selectedSizes = [];
      $('#filterItems input[type="checkbox"]').each(function() {
          if ($(this).is(':checked')) {
             
              if ($(this).parent().parent().find('h5').text() === 'Category') {
                  selectedCategories.push($(this).attr('id'));
              } 
              if ($(this).parent().parent().find('h5').text() === 'Size') {
                let selectedId= $(this).attr('id');
                selectedId = Number(selectedId);
                selectedSizes.push(selectedId);                
              }
          }
      });

      let filteredProducts = CLOTHES.filter(function(product) {
          if (selectedCategories.length > 0 && !selectedCategories.includes(product.category.toString())) {
              return false; 
          }

          if (selectedSizes.length > 0) {            
            let hasSelectedSize = selectedSizes.some(sizeId => product.sizes.includes(sizeId));
              if (!hasSelectedSize) {
                  return false;
              }
          }
          return true;
      });

      if(filteredProducts.length){
        displayProducts(filteredProducts, '#allProducts');
      }else{
        $('#allProducts').html('<p class="fw-bold">No products found.</p>');
      }  
  });   
    }
   // End shop.html

    //cart.html
   if(url.includes('cart.html')){
      let productsInLS = getFromLocalStorage('cart');
      let allProducts = getFromLocalStorage('allProducts');

      if(productsInLS){
        displayCart(productsInLS);
      }else{
        displayEmptyCart();
      }

      $(document).on('click', '#cancel', function(){

        localStorage.removeItem('cart');
        displayEmptyCart();
      })

      $(document).on('click', '.delete', function(){
        let productsInLS = getFromLocalStorage('cart');
        let idProduct = $(this).data('delete-id');

        let productsAfterDelete = productsInLS.filter(x=>x.id != idProduct);
        if(!productsAfterDelete.length){
          localStorage.removeItem('cart')
          displayEmptyCart();
        } else{
          setLocalStorage('cart', productsAfterDelete);
          displayCart(productsAfterDelete);
        }       
      })

      //functions
      function displayEmptyCart(){
        let display = `<div class="bg-grey py-5 rounded">
        <div class="text-center py-3 mb-2">
            <h4 class="mb-0 dark-green">Cart is Empty</h4>        
        </div>
        <div class="text-center">
            <a href="shop.html" class="button-style bg-yellow border-white px-3 rounded">SHOP NOW</a>
        </div>
        </div>`;
        $('#cart').html(display);      
      }
      
      function displayCart(productsInLS){      
        let display = `<div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th scope="col" class="border-0 bg-light">
                <div class="p-2 px-3 text-uppercase">Product</div>
              </th>
              <th scope="col" class="border-0 bg-light">
                <div class="py-2 text-uppercase">Price</div>
              </th>
              <th scope="col" class="border-0 bg-light">
                <div class="py-2 text-uppercase">Quantity</div>
              </th>
              <th scope="col" class="border-0 bg-light">
                <div class="py-2 text-uppercase">Remove</div>
              </th>
            </tr>
          </thead>
          <tbody>`;
          productsInLS.forEach(x=>{
            display+=`<tr>
            <th scope="row" class="border-0">
              <div class="p-2">
                <img src="${srcPath}${allProducts.find(a=> a.id == x.id).src}" alt="${proccessDescription(x.id)}" width="70" class="img-fluid rounded shadow-sm me-2">
                <div class="ml-3 d-inline-block align-middle">
                  <h5 class="mb-0"> <a href="#" class="text-dark d-inline-block align-middle">${proccessDescription(x.id)}</a></h5>
                </div>
              </div>
            </th>
            <td class="border-0 align-middle"><strong>$${x.price}</strong></td>
            <td class="border-0 align-middle"><strong>${x.qty}</strong></td>
            <td class="border-0 align-middle"><button class="text-dark delete" data-delete-id="${x.id}"><i class="fa fa-trash"></i></button></td>
          </tr> `
          });
          display+=`</tbody>
          </table>         
        </div>
        <div class="bg-yellow text-center py-3">
          <h4 class="mb-0">Total price: ${displayTotalPrice('')}</h4>
        </div>
        <div class="text-end mt-3">
          <button class="bg-green py-2 px-3 rounded border-white text-white" id="order" data-bs-toggle="modal" data-bs-target="#orderModal">Order</button>
          <div class="modal fade" id="orderModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Order</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                    <div class="row">
                      <div class="col">
                        <input type="text" class="form-control" placeholder="First name" id="fname">
                        <p class="text-danger text-start px-2 mb-0"></p>
                      </div>
                      <div class="col">
                        <input type="text" class="form-control" placeholder="Last name" id="lname">
                        <p class="text-danger text-start px-2 mb-0"></p>
                      </div>
                    </div>
                    <div class="form-group mt-3">
                      <input type="text" class="form-control" placeholder="Email" id="email">
                      <p class="text-danger text-start px-2 mb-0"></p>
                    </div>
                    <div class="form-group mt-3">
                      <input type="text" class="form-control" placeholder="Number" id="phone">
                      <p class="text-danger text-start px-2 mb-0"></p>
                    </div>
                    <div class="form-group mt-3">
                     <select id="orderType" class="form-control">                      
                     </select>
                     <p class="text-danger text-start px-2 mb-0"></p>
                    </div>
                    <div class="form-group mt-3">
                      <input type="checkbox" id="subscribe">
                      <label class="form-check-label" for="subscribe">
                      Subscribe to our newsletter
                      </label>
                    </div>
                  </form>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                <div>
                  <span class="text-secondary">Delivery date: ${processOrderDate()}</span>
                </div>
                  <div>
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn bg-green text-white" id="orderButton">Order</button>
                  <div class="toast-container position-fixed bottom-0 start-0 p-6">
                  <div class="toast text-bg-success" id="orderToast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-body">
                      <div class="d-flex gap-4">
                        <span><i class="fa-solid fa-circle-check fa-lg icon-success"></i></span>
                        <div class="d-flex flex-grow-1 align-items-center">
                          <div class="d-flex align-items-center">
                            <span class="fw-semibold">Your order successfully received!</span>
                          </div>                         
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  </div>                
                </div>
              </div>
            </div>
          </div>
          <button class="bg-danger py-2 px-3 rounded border-white text-white" id="cancel">Cancel</button>         
        </div>`;

        $('#cart').html(display);
      }
      asynFunctionCallCart();
      function displayOrderTypes(orders){
        let display = `<option value="0">Choose delivery method</option>`;

        orders.forEach(x=>{
            display +=`<option value="${x.id}">${x.name}</option>`;

        })
        $('#orderType').html(display);
      }
      function proccessDescription(id){
        return allProducts.find(x=> x.id == id).description;
      }
      function processOrderDate(){
        let today = new Date();
        let futureDate = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
        let formattedDate = formatDate(futureDate);
       
      function formatDate(date) {          
              let day = date.getDate();
              let month = date.getMonth() + 1;
              let year = date.getFullYear();            
              return day + '.' + month + '.' + year;
          }
          return formattedDate;
        }
        
        let regExName = /^[A-ZČĆŠĐŽ][a-zčćšđž]{2,}$/;
        let regExEmail = /^[a-z0-9]{3,}([\.][a-z0-9\-\$\*\_]+)*[\@](gmail.com|yahoo.com|edu.rs)$/;
        let regExPhone = /^06[0-9]\/[0-9]{7}$/;
        
        var error = false;
        function validateRegEx(regEx, element, requiredText, exampleText) {
          if ($(element).val() == 0) {
              $(element).addClass('border-danger');
              $(element).next().text(requiredText + ' is required.');
              error = true;
              return;
          }
          if (!$(element).val().match(regEx)) {
              $(element).addClass('border-danger');
              $(element).next().html(exampleText);
              error = true;
          }
          else {
              $(element).removeClass('border-danger');
              $(element).addClass('border-success');
              $(element).next().text('');
          }
      }
          $('#fname').blur(function () {
              validateRegEx(regExName, '#fname', 'First name', 'Example: Ana');
          })

          $('#lname').blur(function () {
              validateRegEx(regExName, '#lname', 'Last name', 'Example: Smith');
          })

          $('#email').blur(function () {
              validateRegEx(regExEmail, '#email', 'Email', 'Example: example@gmail.com');
          })
          $('#phone').blur(function () {
            validateRegEx(regExPhone, '#phone', 'Number', 'Format: 061/1234567');
        })
        $('#orderType').change(function(){
          if($('#orderType option:selected').index() == 0){
            $('#orderType').addClass('border-danger');
            $('#orderType').next().text('Please choose delivery');
            error = true;
          }else{
            $('#orderType').removeClass('border-danger');
            $('#orderType').addClass('border-success');
            $('#orderType').next().text('');
          }
        })
        $('#orderButton').click(validateOnSubmit);

        function validateOnSubmit() {
           
            error = 0;
            validateRegEx(regExName, '#fname', 'First name', 'Example: Ana');
            validateRegEx(regExName, '#lname', 'Last name', 'Example: Smith');
            validateRegEx(regExEmail, '#email', 'Email', 'Example: example@gmail.com');
            validateRegEx(regExPhone, '#phone', 'Number', 'Format: 061/1234567');
            if (!error) {
                $('#orderButton').next().removeClass('d-none');
              let toastLive = $('#orderToast');
                let toast = new bootstrap.Toast(toastLive);
                toast.show();    
                localStorage.removeItem('cart');  
                      
            }
            else {
                $('#orderButton').next().addClass('d-none');
            }         
        }
   }
});