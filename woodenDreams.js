//to open and close the header navbar menu list
function displayNavbar(){
  document.getElementById("headerNavbar").classList.toggle("visible");   
}


//to close the header navbar menu list when clicked outside the button and navbar
document.addEventListener("click", function(event) {
  const headerNavbar = document.getElementById("headerNavbar");
  const navbarShortIcon = document.getElementById("navbarShortIcon");

  if ( !headerNavbar.contains(event.target) && !navbarShortIcon.contains(event.target) ) {
    headerNavbar.classList.remove("visible");
  }
});


//to get the category data list
async function getCategoryData(){
  let response = await fetch("woodenDreamsCategory.json");
  let categoryData = await response.json();
  return categoryData;
}


//to get the category data list
async function getProductData(){
  let response = await fetch("woodenDreamsProducts.json");
  let productsData = await response.json();
  return productsData;
}


//signin/signout btn fuctionality 
function signinSignout(){
  signinstatus = sessionStorage.getItem("wdissignin") || ""
  if(signinstatus === "signin"){
    signout();
  }else if(signinstatus === ""){
    window.location.href = "signin.html"
  }
}

function signin(username){
  sessionStorage.setItem("wdissignin","signin");
  sessionStorage.setItem("wduserid",username);
  alert("Signed In Successful");
  previouspage();
}

function signout(){
  let signoutconfirm = confirm("Are you Sure you want to Sign out")
  if(signoutconfirm){
    sessionStorage.removeItem("wdissignin");
    sessionStorage.removeItem("wduserid");
    updateloginstatus();
    alert("Signed Out successfully");
    window.location.reload();
  }
}

function previouspage(){
  window.history.back();
}


function updateloginstatus(){
  let signinstatus = sessionStorage.getItem("wdissignin") || "";
  if(signinstatus === "signin"){
      document.getElementById("signInorSignUpbtn").textContent = "Sign Out";
  }else if(signinstatus === ""){
      document.getElementById("signInorSignUpbtn").textContent = "Sign In";
  }
}



async function displaycategories(){
  let displaycategoryarea = document.getElementById("displaycategoryarea");
  displaycategoryarea.innerHTML = ""

  let categories = await getCategoryData();
  
  categories.forEach(singlecategory => {
      displaycategoryarea.innerHTML += 
      `
      <div class="displaysinglecategory" id="${singlecategory.category}" onclick="selectcategory('${singlecategory.category}')">
          <div class="categoryimage">
              <img src="${singlecategory.imagepath}" alt="${singlecategory.category} image">
          </div>
          <div class="categoryname">
              <span>${singlecategory.category}</span>
          </div>
      </div>
      `
  });
}


function selectcategory(singlecategory){
  sessionStorage.setItem("wdcategoryavailable",singlecategory);
  window.location.href="shop.html"
  
}



async function displayproducts(category, element, division){
  
  element.innerHTML = ""
  let products = {}
    if(category === ""){
      let productlist = await getProductData();
      products = productlist.filter(product=> product.division === division)
    }else if(category){
      let productlist = await getProductData();
      products = productlist.filter(product=> product.category === category && product.division === division)
    }

    if(products.length === 0){
      element.innerHTML = `<p></p><p style="color:red">Currently no item is available under ${category} category</p>`
    }
    else{
      products.forEach(singleproduct => {
        const productElement = createSingleProductElement(singleproduct);
        element.appendChild(productElement);
    });
    }
    
    
}





function createSingleProductElement(singleproduct) {
  // Create main container
  const container = document.createElement('div');
  container.className = 'displaysingleproduct';
  container.id = `singleproduct${singleproduct.productid}`;

  container.addEventListener("mouseenter",()=>{
    let AddToCartArea = createAddToCartArea(singleproduct);
    container.prepend(AddToCartArea);
  })

  container.addEventListener("mouseleave", () => {
  const existing = container.querySelector('.addtocartarea');
  if (existing) {
    existing.remove();
  }
});

  // Product image wrapper
  const imageDiv = document.createElement('div');
  imageDiv.className = 'productimage';

  const img = document.createElement('img');
  img.src = singleproduct.imagepath;
  img.alt = `${singleproduct.name} image`;

  imageDiv.appendChild(img);
  container.appendChild(imageDiv);

  // Product details wrapper
  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'productdetails';

  // Name
  const nameDiv = document.createElement('div');
  nameDiv.className = 'productname';
  const nameSpan = document.createElement('span');
  nameSpan.textContent = singleproduct.name;
  nameDiv.appendChild(nameSpan);
  detailsDiv.appendChild(nameDiv);

  // Description
  const descDiv = document.createElement('div');
  descDiv.className = 'productdesc';
  const descSpan = document.createElement('span');
  descSpan.textContent = singleproduct.shortdesc;
  descDiv.appendChild(descSpan);
  detailsDiv.appendChild(descDiv);

  // Price area
  const priceArea = document.createElement('div');
  priceArea.className = 'productpricearea';

  const priceSpan = document.createElement('span');
  priceSpan.className = 'productprice';
  priceSpan.textContent = `Rs ${singleproduct.price.toFixed(2)}`;

  const highPriceSpan = document.createElement('span');
  highPriceSpan.className = 'producthighprice';
  if(singleproduct.highprice === ""){
    highPriceSpan.textContent = "14000"
    highPriceSpan.style.visibility= "hidden";
  }else{
    highPriceSpan.textContent = `Rs ${singleproduct.highprice.toFixed(2)}`;
  }
  

  priceArea.appendChild(priceSpan);
  priceArea.appendChild(highPriceSpan);
  detailsDiv.appendChild(priceArea);

  container.appendChild(detailsDiv);

  return container;
}


function createAddToCartArea(singleproduct) {
  // Outer container
  const addToCartArea = document.createElement('div');
  addToCartArea.className = 'addtocartarea';

  // Add to cart button container
  const cartButtonWrapper = document.createElement('div');

  const cartButton = document.createElement('button');
  cartButton.className = 'addtocartbtn';
  cartButton.id = 'addtocartbtn';
  cartButton.textContent = 'Add to cart';

  cartButton.onclick = () => toggleaddtocart(cartButton,singleproduct);

  cartButtonWrapper.appendChild(cartButton);
  addToCartArea.appendChild(cartButtonWrapper);

   let productsincart = JSON.parse(localStorage.getItem("wdcartitems")) || [];
  let signinuser = sessionStorage.getItem("wduserid")
   productsincart = productsincart.filter(items => items.loginuserid === signinuser)
    productsincart.forEach(cartitem => {
        if(singleproduct.productid === cartitem.productid){
            cartButton.classList.toggle("active");
            cartButton.textContent = 'Remove from Cart';
        }
    });

  // Function button area
  const functionBtnArea = document.createElement('div');
  functionBtnArea.className = 'addtocartareafunctionbtn';

  // Share button
  const shareBtn = document.createElement('div');
  shareBtn.className = 'sharebtnarea';
  shareBtn.id = 'sharebtnarea';

  const shareImg = document.createElement('img');
  shareImg.src = 'image/share_icon.png';
  shareImg.alt = '';

  const shareText = document.createElement('span');
  shareText.textContent = 'Share';

  shareBtn.appendChild(shareImg);
  shareBtn.appendChild(shareText);
  functionBtnArea.appendChild(shareBtn);

  // Quick View button
  const quickViewBtn = document.createElement('div');
  quickViewBtn.className = 'quickviewbtnarea';

  const quickViewImg = document.createElement('img');
  quickViewImg.src = 'image/quickview_icon.png';
  quickViewImg.alt = '';

  const quickViewText = document.createElement('span');
  quickViewText.textContent = 'Quick View';

  
  quickViewBtn.onclick = () => displayproductdetails(singleproduct);

  quickViewBtn.appendChild(quickViewImg);
  quickViewBtn.appendChild(quickViewText);
  functionBtnArea.appendChild(quickViewBtn);


  // Wishlist button
  const wishlistBtn = document.createElement('div');
  wishlistBtn.className = 'wishlistbtnarea';

  const wishlistImg = document.createElement('img');
  wishlistImg.src = 'image/emptyheart_icon.png';
  wishlistImg.alt = '';

  wishlistBtn.onclick = () => toggleWishlist(wishlistImg,singleproduct);

 

  const wishlistText = document.createElement('span');
  wishlistText.textContent = 'Like';

  wishlistBtn.appendChild(wishlistImg);
  wishlistBtn.appendChild(wishlistText);
  functionBtnArea.appendChild(wishlistBtn);

    let wdwishlistitem = JSON.parse(localStorage.getItem("wdwishlistitems")) || [];
    wdwishlistitem = wdwishlistitem.filter(items => items.loginuserid === signinuser)
    wdwishlistitem.forEach(wishitem => {
      if(singleproduct.productid === wishitem.productid){
          wishlistImg.classList.toggle("active");
          wishlistImg.src = 'image/redheart_icon.png';
      }
  });

  // Append function buttons to main area
  addToCartArea.appendChild(functionBtnArea);

  return addToCartArea;
}



function toggleWishlist(element,item) {

  signinuser = sessionStorage.getItem("wduserid") || ""
  if(signinuser){
    element.classList.toggle("active");
    const isImage = element.tagName === "IMG";
    if(element.classList.contains("active")){
      if(isImage){
        element.src = 'image/redheart_icon.png';
      }
      else{
        element.textContent = "Remove wishlist";
      }
      addtowishlist(item,signinuser);
    }else{
      if(isImage){
        element.src = 'image/emptyheart_icon.png';
        
      }
      else{
        element.textContent = "Add to Wishlist";
      }
      removefromwishlist(item,signinuser)
    }
  }else{
    alert("Sign In to add products to wishlist")
    window.location.href = "signin.html"
  }
}


function addtowishlist(item,signinuser){
  let productsinwishlist1 = JSON.parse(localStorage.getItem("wdwishlistitems")) || [];
  let productsinwishlist = productsinwishlist1.filter(items => items.loginuserid === signinuser);
      if(!productsinwishlist.find(items => items.productid === item.productid)){
            item.loginuserid = signinuser;
            productsinwishlist1.push(item);
            localStorage.setItem("wdwishlistitems",JSON.stringify(productsinwishlist1));
            updatewishlistcount();
      }
}

function removefromwishlist(item,signinuser){
  let productsinwishlist = JSON.parse(localStorage.getItem("wdwishlistitems"));
        productsinwishlist.forEach((items,index) =>{
            if(items.loginuserid === signinuser && items.productid === item.productid){
                productsinwishlist.splice(index,1);
                localStorage.setItem("wdwishlistitems",JSON.stringify(productsinwishlist));
                updatewishlistcount();
            }
      })
}


function removeallwishlistofuser(signinuser){
  let productsinwishlist = JSON.parse(localStorage.getItem("wdwishlistitems"));
        let updatedWishlist = productsinwishlist.filter(item => item.loginuserid !== signinuser);
        localStorage.setItem("wdwishlistitems",JSON.stringify(updatedWishlist));
        updatewishlistcount();
    
}





function toggleaddtocart(element,item) {

  signinuser = sessionStorage.getItem("wduserid") || ""
  if(signinuser){
    element.classList.toggle("active");

    if(element.classList.contains("active")){
        element.textContent = 'Remove from Cart';
        addtocart(item,signinuser);

    }
    else{
        element.textContent = 'Add to cart';
        removefromcart(item,signinuser);
    }

  }else{
    alert("Sign In to add products to cart")
    window.location.href = "signin.html"
  }

}

function addtocart(item,signinuser){
  let productsincart1 = JSON.parse(localStorage.getItem("wdcartitems")) || [];
  let productsincart = productsincart1.filter(items => items.loginuserid === signinuser);
    if(!productsincart.find(items => items.productid === item.productid)){
      item.loginuserid = signinuser;        
      item.purchasecount = 1;
      productsincart1.push(item);
      localStorage.setItem("wdcartitems",JSON.stringify(productsincart1));
      updatecartcount();
    }
}

function removefromcart(item,signinuser){
  let productsincart = JSON.parse(localStorage.getItem("wdcartitems"));
  
        productsincart.forEach((items,index) =>{
            if(items.loginuserid === signinuser && items.productid === item.productid){
              
                productsincart.splice(index,1);
                localStorage.setItem("wdcartitems",JSON.stringify(productsincart));
                updatecartcount();
            }
        })

}

function removeallcartlistofuser(signinuser){
  let productsincartlist = JSON.parse(localStorage.getItem("wdcartitems"));
        let updatedcartlist = productsincartlist.filter(item => item.loginuserid !== signinuser);
        localStorage.setItem("wdcartitems",JSON.stringify(updatedcartlist));
        updatecartcount();
    
}


function updatecartcount(){
  signinuser = sessionStorage.getItem("wduserid") || ""
  if(signinuser){
      let productsincart = JSON.parse(localStorage.getItem("wdcartitems")) || [];
      productsincart = productsincart.filter(item => item.loginuserid === signinuser)
      const cartitemcount = document.getElementById("cartitemcount");  
      let totalcartcount = 0;
      productsincart.forEach(item =>{
          totalcartcount += item.purchasecount;
      })
      cartitemcount.innerText = `(${totalcartcount})` ;
  }
}


function updatewishlistcount(){
  signinuser = sessionStorage.getItem("wduserid") || ""
  if(signinuser){
    let productsinwishlist = JSON.parse(localStorage.getItem("wdwishlistitems")) || [];
    productsinwishlist = productsinwishlist.filter(item => item.loginuserid === signinuser)
    const wishitemcount = document.getElementById("wishitemcount");  
    wishitemcount.innerText =  `(${productsinwishlist.length})`;
  }
}


function displayproductdetails(singleproduct){
  localStorage.setItem("wdselectedproduct", JSON.stringify(singleproduct));
  window.location.href = "productdetails.html";
    
      
}

function singleproductdetailsinfo(product){
        const container = document.createElement("div");
        container.className = "container"

        const imageGallery = document.createElement("div");
        imageGallery.className = "image-gallery";

        const thumbnailsDiv = document.createElement("div");
        thumbnailsDiv.className = "thumbnails";

        const mainImageDiv = document.createElement("div");
        mainImageDiv.className = "main-image";

        const mainImage = document.createElement("img");
        mainImage.id = "productmainimage";
        mainImage.src = product.imagepath;
        mainImage.alt = "Main Image";
        mainImageDiv.appendChild(mainImage);

        product.alternateimages.forEach(src => {
            const thumb = document.createElement("img");
            thumb.src = src;
            thumb.alt = "Product thumbnail";
            thumb.addEventListener("click", () => {
                mainImage.src = src;
            });
            thumbnailsDiv.appendChild(thumb);
        });

        imageGallery.appendChild(thumbnailsDiv);
        imageGallery.appendChild(mainImageDiv);
        container.appendChild(imageGallery);

       
        const info = document.createElement("div");
        info.className = "product-info";

        const title = document.createElement("h2");
        title.textContent = product.name;

        const shortdesc = document.createElement("div");
        shortdesc.textContent = `( ${product.shortdesc} )`;

        const stars = document.createElement("div");
        stars.className = "stars";
        stars.textContent = product.reviews;

        const price = document.createElement("div");
        price.className = "price";

        if(product.highprice){
          price.innerHTML = `₹${product.price.toFixed(2)} <del>₹${product.highprice.toFixed(2)}</del>`;
        }
        else{
          price.innerHTML = `₹${product.price.toFixed(2)}`;
        }
        
        info.appendChild(title);
        info.appendChild(shortdesc);
        info.appendChild(stars);
        info.appendChild(price);

        

        const colorOption = document.createElement("div");
        colorOption.className = "options";
        colorOption.innerHTML = "<h4>Color</h4>";

        const colorSquares = document.createElement("div");
        colorSquares.className = "color-squares";

        product.productcolor.forEach(color => {
            const box = document.createElement("div");
            box.style.cssText = `background:${color};`;
            box.title = color;
            box.addEventListener("click", () => {
                alert(`Color selected: ${color}`);
            });
            colorSquares.appendChild(box);
        });

        colorOption.appendChild(colorSquares);
        info.appendChild(colorOption);

    
        const sizeOption = document.createElement("div");
        sizeOption.className = "options";
        sizeOption.innerHTML = "<h4>Size</h4>";

        const sizeButtons = document.createElement("div");
        sizeButtons.className = "size-buttons";

        product.productsize.forEach(size => {
            const btn = document.createElement("button");
            btn.textContent = size;
            btn.addEventListener("click", () => {
                alert(`Size selected: ${size}`);
            });
            sizeButtons.appendChild(btn);
        });

        sizeOption.appendChild(sizeButtons);
        info.appendChild(sizeOption);

        
        const quantityDiv = document.createElement("div");
        quantityDiv.className = "quantity";
        quantityDiv.style.display = "none"
        quantityDiv.id = "cartitemquantityarea";
        quantityDiv.innerHTML = "<h4>Quantity</h4>";

        const decBtn = document.createElement("button");
        decBtn.textContent = "-";
        decBtn.id = "itemdecreasebtn";

        const quantityInput = document.createElement("input");
        quantityInput.type = "text";
        quantityInput.readOnly = true;
        quantityInput.id = "cartitemquantitydisplay";

        const incBtn = document.createElement("button");
        incBtn.textContent = "+";
        incBtn.id = "itemincreasebtn";

        quantityDiv.appendChild(decBtn);
        quantityDiv.appendChild(quantityInput);
        quantityDiv.appendChild(incBtn);
        info.appendChild(quantityDiv);

        

        incBtn.addEventListener("click", () => {
            increaseitemcount();
        });
        decBtn.addEventListener("click", () => {
            decreaseitemcount();
        });

        const buttonsDiv = document.createElement("div");
        buttonsDiv.className = "buttons";

        const cartBtn = document.createElement("button");
        cartBtn.className = "add-cart";
        cartBtn.textContent = "Add to Cart";

        const wishlistBtn = document.createElement("button");
        wishlistBtn.className = "wishlist";
        wishlistBtn.textContent = "Add to Wishlist";

        buttonsDiv.appendChild(cartBtn);
        buttonsDiv.appendChild(wishlistBtn);
        info.appendChild(buttonsDiv);

        let userid = sessionStorage.getItem("wduserid") || "";
        updatecartandwishproductdetailarea();

        
        cartBtn.onclick=()=> addtocartinproductdetails(cartBtn,product)
        wishlistBtn.onclick = () => toggleWishlist(wishlistBtn,product);

        container.appendChild(info);


        const tabsContainer = document.createElement("div");
        tabsContainer.className = "tabs container";

        const tabButtons = document.createElement("div");
        tabButtons.className = "tab-buttons";

        const contentDiv = document.createElement("div");
        contentDiv.className = "tab-content";
        contentDiv.innerHTML = `<p>${product.description}</p>`;

        const btn1 = document.createElement("button");
        btn1.className = "description";
        btn1.textContent = "Description";
        btn1.classList.add("active");

        const btn2 = document.createElement("button");
        btn2.className = "additionalinfo";
        btn2.textContent = "Additional Info";

        const btn3 = document.createElement("button");
        btn3.className = "reviews";
        btn3.textContent = "Reviews";

        btn1.addEventListener('click',()=>{
          btn1.classList.add("active");
          btn2.classList.remove("active");
          btn3.classList.remove("active");
          contentDiv.innerHTML = `${product.description}`;
        })

        btn2.addEventListener('click',()=>{
          btn2.classList.add("active");
          btn1.classList.remove("active");
          btn3.classList.remove("active");
          contentDiv.innerHTML = `${product.additionalinfo}`;
        })

        btn3.addEventListener('click',()=>{
          btn3.classList.add("active");
          btn1.classList.remove("active");
          btn2.classList.remove("active");
          
          
          contentDiv.innerHTML = `${product.comments}`;
        })

        // Object.keys(product.tabs).forEach(key => {
        //     const btn = document.createElement("button");
        //     btn.className = key;
        //     btn.textContent = key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^\w/, c => c.toUpperCase());
        //     btn.addEventListener("click", () => {
        //         contentDiv.innerHTML = `<p>${product.tabs[key]}</p>`;
        //         [...tabButtons.children].forEach(b => b.classList.remove("active"));
        //         btn.classList.add("active");
        //     });
        //     tabButtons.appendChild(btn);
        // });

        tabButtons.appendChild(btn1);
        tabButtons.appendChild(btn2);
        tabButtons.appendChild(btn3);

        tabsContainer.appendChild(tabButtons);
        tabsContainer.appendChild(contentDiv);

        const div = document.createElement("div");
        div.appendChild(container);
        div.appendChild(tabsContainer);
        return div;

        

        function updatecartandwishproductdetailarea(){
          
          let cartItems = JSON.parse(localStorage.getItem("wdcartitems")) || [];
          if(userid){
            cartItems = cartItems.filter(cartitem => cartitem.loginuserid === userid) 
                    
          }
          
          let matchedItem = cartItems.find(cartitem => cartitem.productid === product.productid);
          if (matchedItem) {
            quantityDiv.style.display = "block"
            quantityInput.value = matchedItem.purchasecount;
            cartBtn.classList.add("active");
            cartBtn.textContent = "Remove from Cart";
                
          }
          else{
            quantityDiv.style.display = "none";
            cartBtn.classList.remove("active");
            cartBtn.textContent = "Add to Cart";
          }

          let wishlistItems = JSON.parse(localStorage.getItem("wdwishlistitems")) || [];
          if(userid){
            wishlistItems = wishlistItems.filter(wishitem => wishitem.loginuserid === userid) 
                    
          }

          let matchedwishItem = wishlistItems.find(wishitem => wishitem.productid === product.productid);
          if(matchedwishItem){
            wishlistBtn.classList.add("active");
            wishlistBtn.textContent = "Remove Wishlist";
          }
          else{
            wishlistBtn.classList.remove("active");
            wishlistBtn.textContent = "Add to Wishlist";
          }
        }

        function addtocartinproductdetails(cartBtn,product){
          toggleaddtocart(cartBtn,product);
          updatecartandwishproductdetailarea();
        }

        function increaseitemcount(){
          let cartItems = JSON.parse(localStorage.getItem("wdcartitems"));
          let item = cartItems.find(cartitem => cartitem.loginuserid === userid && cartitem.productid === product.productid) 
          
                if(item.purchasecount < item.availablestock){
                    item.purchasecount = item.purchasecount+1;
                    localStorage.setItem("wdcartitems",JSON.stringify(cartItems));
                    updatecartandwishproductdetailarea();
                    updatecartcount()
                }else{
                    alert(`"${item.name}" has only ${item.availablestock} stock.`);
                }
                 
        }

        function decreaseitemcount(){
          let cartItems = JSON.parse(localStorage.getItem("wdcartitems"));
          let item = cartItems.find(cartitem => cartitem.loginuserid === userid && cartitem.productid === product.productid) 
         
              
                if(item.purchasecount === 1){
                  removeitemfromcartwhenpurchasezero(item);
                  updatecartandwishproductdetailarea();
                }
                else{
                  item.purchasecount = item.purchasecount - 1;
                  localStorage.setItem("wdcartitems",JSON.stringify(cartItems));
                  updatecartandwishproductdetailarea();
                  updatecartcount()
                }
              
        
        }


        function removeitemfromcartwhenpurchasezero(item){
          let cartItems = JSON.parse(localStorage.getItem("wdcartitems"));
          cartItems.forEach((items,index)=>{
            if(items.loginuserid === item.loginuserid && items.productid === item.productid){
              cartItems.splice(index,1);
              localStorage.setItem("wdcartitems",JSON.stringify(cartItems));
            }
              
          })
            
        }

        
}


/*  create wishlish page items*/

    function createwishLayout() {
      
    let signinuser = sessionStorage.getItem("wduserid");
    let wishItems = JSON.parse(localStorage.getItem("wdwishlistitems")) || [];
        wishItems = wishItems.filter(items=> items.loginuserid === signinuser)
    const wishDisplayArea = document.createElement("div");
    wishDisplayArea.id = "wishdisplayarea";
    wishDisplayArea.className = "washlistdisplayarea";

    // 1. Cart Heading Area
    const wishHeadingArea = document.createElement("div");
    wishHeadingArea.className = "cartheadingarea";
    wishHeadingArea.id = "wishheadingarea";

    const wishtitleContainer = document.createElement("div");

    const wishtitle = document.createElement("span");
    wishtitle.className = "carttitle";
    wishtitle.textContent = "Wishlist";

    const wishitemCount = document.createElement("span");
    wishitemCount.className = "cartitemcountdisplay";
    wishitemCount.id = "wishitemcountdisplay";
    wishitemCount.innerText=`(${wishItems.length})`;
    
    

    wishtitleContainer.appendChild(wishtitle);
    wishtitleContainer.appendChild(wishitemCount);

    const wishclearBtn = document.createElement("button");
    wishclearBtn.className = "clearcartbtn";
    wishclearBtn.textContent = "Clear Wishlist";
    wishclearBtn.onclick = () =>{
        removeallwishlistofuser(signinuser);
        window.location.href = "wishlistpage.html";
    };

    wishHeadingArea.appendChild(wishtitleContainer);
    wishHeadingArea.appendChild(wishclearBtn);

    const wishhr = document.createElement("hr");




    // 2. Cart Items Display Area with each wishlist item display
    const wishItemsDisplayArea = document.createElement("div");
    wishItemsDisplayArea.className = "cartitemsdisplayarea";
    wishItemsDisplayArea.id = "wishitemsdisplayarea";

    wishItems.forEach((item, index) => {
                
    const wishitemWrapper = document.createElement("div");
    wishitemWrapper.className = "cartsingleitemdisplay";
    wishitemWrapper.id = `wishsingleitem${index}`;

    const wishimg = document.createElement("img");
    wishimg.className = "cartitemimage";
    wishimg.src = item.imagepath;
    wishimg.alt = item.productid;

    const wishdescription = document.createElement("div");
    wishdescription.className = "cartitemdescription";

    const wishnameSpan = document.createElement("span");
    wishnameSpan.className = "cartitemname";
    wishnameSpan.id = `wishitem${index}name`;
    wishnameSpan.textContent = item.name;

    const wishdescSpan = document.createElement("span");
    wishdescSpan.className = "cartitemquantity";
    wishdescSpan.id = `wishitem${index}description`;
    wishdescSpan.textContent = item.shortdesc;

    wishdescription.appendChild(wishnameSpan);
    wishdescription.appendChild(wishdescSpan);

    const wishpriceDiscount = document.createElement("div");
    wishpriceDiscount.className = "cartitempriceanddiscount";

    const wishprice = document.createElement("div");
    wishprice.className = "cartitemprice";
    wishprice.id = `wishitem${index}price`;
    wishprice.textContent = `₹ ${item.price.toFixed(2)}`;

    const wishdiscount = document.createElement("div");
    wishdiscount.className = "cartitemdiscountprice";
    wishdiscount.id = `wishitem${index}discountprice`;

    if(item.highprice){
        wishdiscount.textContent = `₹ ${item.highprice.toFixed(2)}`;
    }
    else{
        wishdiscount.innerText = "";
    }
    

    wishpriceDiscount.appendChild(wishprice);
    wishpriceDiscount.appendChild(wishdiscount);



    const wishfinalDiv = document.createElement("div");
    wishfinalDiv.className = "cartitemfinalprice";
    wishfinalDiv.id = "wishitemfinalprice";


    const wishremoveBtn = document.createElement("button");
    wishremoveBtn.className = "removeitembtn";
    wishremoveBtn.textContent = "Remove Item";
    wishremoveBtn.onclick = () => {
        removefromwishlist(item,signinuser);
        window.location.href="wishlistpage.html";
    };

    wishfinalDiv.appendChild(wishremoveBtn);

    wishitemWrapper.appendChild(wishimg);
    wishitemWrapper.appendChild(wishdescription);
    wishitemWrapper.appendChild(wishpriceDiscount);
    wishitemWrapper.appendChild(wishfinalDiv);
    wishItemsDisplayArea.appendChild(wishitemWrapper);
    });

    // 3. Cart Total Display Area with summary
    const wishTotalDisplayArea = document.createElement("div");
    wishTotalDisplayArea.className = "carttotaldisplayarea";

    const wishcontinueShoppingArea = document.createElement("div");
    wishcontinueShoppingArea.className = "continueshoppingbtnarea";

    const wishcontinueLink = document.createElement("a");
    wishcontinueLink.className = "continueshoppingbtn";
    wishcontinueLink.href = "shop.html";
    wishcontinueLink.textContent = "Continue Shopping";

    wishcontinueShoppingArea.appendChild(wishcontinueLink);
    wishTotalDisplayArea.appendChild(wishcontinueShoppingArea);

    // Append all to main
    wishDisplayArea.appendChild(wishHeadingArea);
    wishDisplayArea.appendChild(wishhr);
    wishDisplayArea.appendChild(wishItemsDisplayArea);
    wishDisplayArea.appendChild(wishTotalDisplayArea);

    if(wishItems.length === 0){
        wishItemsDisplayArea.innerHTML = `
        <p style="padding: 30px 0px">Your Wishlist is empty</p>
        `;
        wishclearBtn.style.display = "none";
    }

    return wishDisplayArea;
}




/*  to generate cart page */

//to create layout for addtocart page
    function createCartLayout() {
      let signinuser = sessionStorage.getItem("wduserid");
      let cartItems = JSON.parse(localStorage.getItem("wdcartitems")) || [];
          cartItems = cartItems.filter(items=> items.loginuserid === signinuser)
        let totalbill = 0;
    const cartDisplayArea = document.createElement("div");
    cartDisplayArea.id = "cartdisplayarea";
    cartDisplayArea.className = "cartdisplayarea";

    // 1. Cart Heading Area
    const cartHeadingArea = document.createElement("div");
    cartHeadingArea.className = "cartheadingarea";
    cartHeadingArea.id = "cartheadingarea";

    const titleContainer = document.createElement("div");

    const title = document.createElement("span");
    title.className = "carttitle";
    title.textContent = "Cart";

    const itemCount = document.createElement("span");
    itemCount.className = "cartitemcountdisplay";
    itemCount.id = "cartitemcountdisplay";
    let totalcartcount = 0;
    cartItems.forEach(item =>{
        totalcartcount += item.purchasecount;
    })
    itemCount.innerText=`(${totalcartcount})`;
    

    titleContainer.appendChild(title);
    titleContainer.appendChild(itemCount);

    const clearBtn = document.createElement("button");
    clearBtn.className = "clearcartbtn";
    clearBtn.textContent = "Clear Cart";
    clearBtn.onclick = () =>{
        removeallcartlistofuser(signinuser)
        window.location.reload();
    };

    cartHeadingArea.appendChild(titleContainer);
    cartHeadingArea.appendChild(clearBtn);

    const hr = document.createElement("hr");

    
    // 2. Cart Items Display Area with each cart item display
    const cartItemsDisplayArea = document.createElement("div");
    cartItemsDisplayArea.className = "cartitemsdisplayarea";
    cartItemsDisplayArea.id = "cartitemsdisplayarea";

    cartItems.forEach((item, index) => {       
         
    const itemWrapper = document.createElement("div");
    itemWrapper.className = "cartsingleitemdisplay";
    itemWrapper.id = `cartsingleitem${index}`;

    const img = document.createElement("img");
    img.className = "cartitemimage";
    img.src = item.imagepath;
    img.alt = `cartitem${index}image`;

    const description = document.createElement("div");
    description.className = "cartitemdescription";

    const nameSpan = document.createElement("span");
    nameSpan.className = "cartitemname";
    nameSpan.id = `cartitem${index}name`;
    nameSpan.textContent = item.name;

    const shortdescSpan = document.createElement("span");
    shortdescSpan.className = "cartitemshortdesc";
    shortdescSpan.id = `cartitem${index}shortdesc`;
    shortdescSpan.textContent = item.shortdesc;

    description.appendChild(nameSpan);
    description.appendChild(shortdescSpan);

    const priceDiscount = document.createElement("div");
    priceDiscount.className = "cartitempriceanddiscount";

    const price = document.createElement("div");
    price.className = "cartitemprice";
    price.id = `cartitem${index}price`;
    price.textContent = `₹ ${item.price.toFixed(2)}`;

    const highprice = document.createElement("div");
    highprice.className = "cartitemhighprice";
    highprice.id = `cartitem${index}highprice`;

    if(item.highprice){
        highprice.textContent = `₹ ${item.highprice.toFixed(2)}`;
    }
    else{
        highprice.innerText = "";
    }
    

    priceDiscount.appendChild(price);
    priceDiscount.appendChild(highprice);

    const countArea = document.createElement("div");
    countArea.className = "cartitemcountarea";

    const decBtn = document.createElement("div");
    decBtn.className = "cartitemcountdecbtn";
    decBtn.id = `cartitem${index}countdecbtn`;
    decBtn.textContent = "-";
    decBtn.onclick = () => decreaseitemcount();

    const countText = document.createElement("div");
    countText.className = "cartitemcounttext";
    countText.id = `cartitem${index}counttext`;
    countText.textContent = item.purchasecount;

    const incBtn = document.createElement("div");
    incBtn.className = "cartitemcountincbtn";
    incBtn.id = `cartitem${index}countincbtn`;
    incBtn.textContent = "+";
    incBtn.onclick = () => increaseitemcount();

    countArea.appendChild(decBtn);
    countArea.appendChild(countText);
    countArea.appendChild(incBtn);

    const finalDiv = document.createElement("div");
    finalDiv.className = "cartitemfinalprice";
    finalDiv.id = "cartitemfinalprice";

    const finalPriceSpan = document.createElement("span");
    finalPriceSpan.className = "cartitemfinalprice";
    finalPriceSpan.id = `cartitem${index}finalprice`;
    let finalpricewithquantity = (item.price * item.purchasecount);
    
    finalPriceSpan.textContent = `₹ ${finalpricewithquantity.toFixed(2)}`;

    const removeBtn = document.createElement("button");
    removeBtn.className = "removeitembtn";
    removeBtn.textContent = "Remove Item";
    removeBtn.onclick = () => {
        removefromcart(item,signinuser);
        window.location.reload()
    };

    finalDiv.appendChild(finalPriceSpan);
    finalDiv.appendChild(removeBtn);

    itemWrapper.appendChild(img);
    itemWrapper.appendChild(description);
    itemWrapper.appendChild(priceDiscount);
    itemWrapper.appendChild(countArea);
    itemWrapper.appendChild(finalDiv);
    cartItemsDisplayArea.appendChild(itemWrapper);
        totalbill  += finalpricewithquantity;

        function updatecartdetailswhencountchange(){
          let cartItemslist = JSON.parse(localStorage.getItem("wdcartitems"));
          let matcheditem = cartItemslist.find(cartitem => cartitem.loginuserid === signinuser && cartitem.productid === item.productid)

          if(matcheditem){
            countText.textContent = matcheditem.purchasecount;
            finalpricewithquantity = (matcheditem.price * matcheditem.purchasecount);
            finalPriceSpan.textContent = `₹ ${finalpricewithquantity.toFixed(2)}`;

            let totalbillvalue = 0;
            let totalcartcount = 0;
            let cartitemslist = cartItemslist.filter(cartitem => cartitem.loginuserid === signinuser)
            cartitemslist.forEach(cartitems=>{
              totalbillvalue += cartitems.price * cartitems.purchasecount;
              totalcartcount += cartitems.purchasecount;
            })
            totalFinal.innerText = `₹ ${totalbillvalue.toFixed(2)}`;
            itemCount.innerText=`(${totalcartcount})`;
            totalCount.innerText = `${totalcartcount} items`
          }
          
        }

        
        function increaseitemcount(){
          let cartItemslist = JSON.parse(localStorage.getItem("wdcartitems"));
          let cartitem = cartItemslist.find(cartitem => cartitem.loginuserid === signinuser && cartitem.productid === item.productid) 
          
                if(cartitem.purchasecount < item.availablestock){
                    cartitem.purchasecount = cartitem.purchasecount + 1;
                    localStorage.setItem("wdcartitems",JSON.stringify(cartItemslist));
                    updatecartdetailswhencountchange();
                    updatecartcount();
                }else{
                    alert(`"${item.name}" has only ${item.availablestock} stock.`);
                }
                 
        }

        function decreaseitemcount(){
          let cartItemslist = JSON.parse(localStorage.getItem("wdcartitems"));
          let cartitem = cartItemslist.find(cartitem => cartitem.loginuserid === signinuser && cartitem.productid === item.productid) 
         
              
                if(cartitem.purchasecount === 1){
                  removeitemfromcartwhenpurchasezero(cartitem);
                  window.location.reload();
                }
                else{
                  cartitem.purchasecount = cartitem.purchasecount - 1;
                  localStorage.setItem("wdcartitems",JSON.stringify(cartItemslist));
                  updatecartdetailswhencountchange();
                  updatecartcount()
                }   
        }


        function removeitemfromcartwhenpurchasezero(item){
          let cartItems = JSON.parse(localStorage.getItem("wdcartitems"));
          cartItems.forEach((items,index)=>{
            if(items.loginuserid === item.loginuserid && items.productid === item.productid){
              cartItems.splice(index,1);
              localStorage.setItem("wdcartitems",JSON.stringify(cartItems));
            }
              
          })
            
        }


    });

    // 3. Cart Total Display Area with summary
    const cartTotalDisplayArea = document.createElement("div");
    cartTotalDisplayArea.className = "carttotaldisplayarea";

    const continueShoppingArea = document.createElement("div");
    continueShoppingArea.className = "continueshoppingbtnarea";

    const continueLink = document.createElement("a");
    continueLink.className = "continueshoppingbtn";
    continueLink.href = "shop.html";
    continueLink.textContent = "Continue Shopping";

    continueShoppingArea.appendChild(continueLink);

    const cartTotalDetails = document.createElement("div");
    cartTotalDetails.className = "carttotaldetails";

    const detail1 = document.createElement("div");
    detail1.className = "carttotaldetail1";

    const totalName = document.createElement("span");
    totalName.className = "carttotalname";
    totalName.textContent = "Total";

    const totalFinal = document.createElement("span");
    totalFinal.className = "carttotalfinalpice";
    totalFinal.id = "carttotalfinalpice";
    totalFinal.innerText = `₹ ${totalbill.toFixed(2)}`;

    detail1.appendChild(totalName);
    detail1.appendChild(totalFinal);

    const detail2 = document.createElement("div");
    detail2.className = "carttotaldetail2";

    const totalCount = document.createElement("span");
    totalCount.className = "carttotalitemcount";
    totalCount.id = "carttotalitemcount";
    totalCount.innerText = `${totalcartcount} items`
   

    detail2.appendChild(totalCount);
   

    const checkoutBtn = document.createElement("button");
    checkoutBtn.className = "checkoutbtn";
    checkoutBtn.id = "checkoutbtn";
    checkoutBtn.textContent = "Check Out";
    checkoutBtn.style.cursor = "pointer";
    checkoutBtn.onclick = ()=>{
        let isloginstatus = sessionStorage.getItem("wdissignin") || "";
        if(isloginstatus === "signin"){
            window.location.href = "checkoutpage.html";
        }else{
            window.location.href = "signin.html";
        }
    }

    cartTotalDetails.appendChild(detail1);
    cartTotalDetails.appendChild(detail2);
    cartTotalDetails.appendChild(checkoutBtn);

    cartTotalDisplayArea.appendChild(continueShoppingArea);
    cartTotalDisplayArea.appendChild(cartTotalDetails);

    // Append all to main
    cartDisplayArea.appendChild(cartHeadingArea);
    cartDisplayArea.appendChild(hr);
    cartDisplayArea.appendChild(cartItemsDisplayArea);
    cartDisplayArea.appendChild(cartTotalDisplayArea);

    

    if(cartItems.length === 0){
        cartItemsDisplayArea.innerHTML = `
        <p style="padding: 30px 0px">Your cart is empty</p>
        `;
        cartTotalDetails.style.display = "none";
        continueShoppingArea.style.margin = "auto";
        clearBtn.style.display = "none";
    }
    return cartDisplayArea;

    
}













