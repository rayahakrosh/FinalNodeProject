function addTitle(){
    let txt = "Products";
    document.getElementById('h1').innerText=txt;
}
async function getData(){
    try{
        let response = await fetch('/p');
        let data = await response.json();
        createGrid(data);
    }catch(err){
        alert(err)
    }
}

function createGrid(data){
    let txt= "";
    for(obj of data){
        if(obj){
            txt +=
              `<div class="card">
                  <div>
                      <img src="../images/${obj.myFileName}?t=${Date.now()}" alt="${obj.name}">
                      <p>${obj.name}</p>
                      <div>${obj.price}</div>
                 </div>
                 <div>
                      <button onclick="deleteProduct(${obj.id})">Delete</button>
                      <button onclick="getById(${obj.id})">Edit</button>
                 </div>
              </div>`

              
        }
    }
    document.getElementById('main').innerHTML=txt;
}

async function addProduct(){
    try{
        let name = document.getElementById('name').value;
        let price = document.getElementById('price').value;
        let myFile = document.getElementById('myFile').files[0];
        let formData=new FormData();
        formData.append('name',name)
        formData.append('price',price)
        if(myFile){
        formData.append('myFile',myFile)
        }
        await fetch('/p',{
            method: 'POST',
            body:formData
        })
        getData();
        clearInputs();
    }catch(err){
        alert(err)
    }
}

function clearInputs(){
    document.getElementById('id').value="";
    document.getElementById('name').value="";
    document.getElementById('price').value="";
    document.getElementById('myFile').value="";
    document.getElementById('myImage').src="";
}

async function deleteProduct(id){
    try{
        if(confirm('האם אתה בטוח')){
          await fetch(`/p/${id}`,{
            method: 'DELETE'
        })
        getData();
        }
    }catch(err){
        alert(err)
    }
}

async function getById(id){
    try{
        let response=await fetch(`/p/${id}`);
        let obj=await response.json();
        document.getElementById('id').value=obj.id;
        document.getElementById('name').value=obj.name;      
        document.getElementById('price').value=obj.price;        
        document.getElementById('myImage').src= "../images/"+ obj.myFileName;
    }catch(err){
        alert(err)
    }
}
async function editProduct(id){
    try{
        let name = document.getElementById('name').value;
        let price = document.getElementById('price').value;
        let myFile = document.getElementById('myFile').files[0];
        let formData=new FormData();
        formData.append('name',name)
        formData.append('price',price)
        if(myFile){
        formData.append('myFile',myFile)
        }
        await fetch(`/p/${id}`,{
            method: 'PATCH',
            body:formData
        })
        getData();
        clearInputs();
    }catch(err){
        alert(err)
    }

}
function addOrEdit(){
    let id = document.getElementById('id').value;
    if(id){
        editProduct(id);
    }else{
        addProduct();
    }
}

getData();
addTitle();