        let thead=document.querySelector('#thead');
        let tbody=document.querySelector('#tbody');
        // div Contents
        let divlogin=document.getElementById('login');
        let tbGame=document.getElementById('tabgame');
        let divTabCriarGame=document.getElementById('divTabCriarGame');
        let divGameNovo=document.querySelector('.cadastroNovoGame');
        let VerList=document.getElementById('vertabela');
        let editarGame=document.querySelector('.editarGame');
        let form1=document.getElementById('form1');

        let form2=document.getElementById('form2');

        let games;


        let axiosConfig={
            headers:{
                Authorization: "Bearer "+localStorage.getItem("token")
            }
        }

        VerList.addEventListener('click',()=>{
            ListGame();
        });
        
        divTabCriarGame.addEventListener('click',()=>{
            tbGame.classList.remove('classShow');
            tbGame.classList.add('classHiden');
            divGameNovo.classList.remove('classHiden');
            divGameNovo.classList.add('classShow');
        });

function Logar() {
            
            let form=document.getElementById("form3");
                form.addEventListener('submit',(e)=>{
                    e.preventDefault();
                })
            let emailLogin=document.getElementById("emailLogin");
            let passwordLogin=document.getElementById("passwordLogin");

            let email=emailLogin.value;
            let Password=passwordLogin.value;

            axios.post("http://localhost:8080/auth",{email,Password}).then(res=>{             
                let token=res.data.token;
                localStorage.setItem("token",token);
                axiosConfig.headers.Authorization="Bearer "+localStorage.getItem("token");
                divlogin.classList.add('classHiden');
                divGameNovo.classList.remove('classHiden');
                divGameNovo.classList.add('classShow');
            }).catch(error=>{
                alert(error);
            })
        }

   function ListGame(){
    tbody.innerHTML="";
        axios.get('http://localhost:8080/games',axiosConfig).then(response=>{
            games=response.data.games;
           
            games.forEach(element => {
                let itembody=document.createElement('tr');
                // tbody

                itembody.innerHTML=`<td>${element.id}</td>`
                itembody.innerHTML+=`<td>${element.title}</td>`
                itembody.innerHTML+=`<td>${element.year}</td>`
                itembody.innerHTML+=`<td>${element.price} - kz</td>`

                itembody.setAttribute("data-id",element.id);
                itembody.setAttribute("data-title",element.title);
                itembody.setAttribute("data-year",element.year);
                itembody.setAttribute("data-price",element.price);

                let btn=document.createElement('button')
                btn.classList.add('bg-red-500');
                btn.classList.add('px-2');
                btn.classList.add('py-1');
                btn.classList.add('text-white');
                btn.classList.add('rounded-md');
                btn.classList.add('mr-4');
                btn.classList.add('mt-4');
                btn.innerHTML="Deletar"

            let btnEdit=document.createElement('button')
            btnEdit.innerHTML="Editar"
            btnEdit.classList.add('bg-blue-500');
            btnEdit.classList.add('px-2');
            btnEdit.classList.add('py-1');
            btnEdit.classList.add('text-white');
            btnEdit.classList.add('rounded-md');
            btnEdit.classList.add('mr-4');
            btnEdit.classList.add('mt-4');
          
            itembody.appendChild(btnEdit);
            itembody.appendChild(btn);
            
            tbody.appendChild(itembody);

            btn.addEventListener("click",(e)=>{
                let id=itembody.getAttribute("data-id");
                DeleteGame(id,e.target);
            })
            

            btnEdit.addEventListener("click",(e)=>{
                LoadListItem(itembody);
            })

            });
          
            divGameNovo.classList.remove('classShow');
            divGameNovo.classList.add('classHiden');
            tbGame.classList.remove('classHiden');
            tbGame.classList.add('classShow');
        }).catch(error=>{
            console.log(error)
        });
    }
    
       

        form1.addEventListener('submit',(e)=>{
            e.preventDefault();
            createGame();
            
        })

        form2.addEventListener('submit',(e)=>{
            e.preventDefault();
            UpdateGame(e.target);
            
        })


        function createGame(){
            let title=document.getElementById('title');
            let year=document.getElementById('year');
            let price=document.getElementById('price');

            let game={
                title:title.value,
                year:year.value,
                price:price.value
            }

        axios.post('http://localhost:8080/game',game,axiosConfig).then(result=>{
            title.value=null;
            year.value=null;
            price.value=null;
            ListGame();
        }).catch(error=>{
        alert(error);
        })
            
        }

        function DeleteGame(id,el){
            if(confirm('Tem certeza que deseja eliminar este game? ')){
                axios.delete('http://localhost:8080/game/'+id,axiosConfig).then(result=>{ 
                    tbody.removeChild(el.parentNode);
                }).catch(error=>{
                    alert(error);
                })
            }

        }

        function LoadListItem(item){
            let id=document.getElementById('idEdit');
            let title=document.getElementById('titleEdit');
            let year=document.getElementById('yearEdit');
            let price=document.getElementById('priceEdit');

            id.value=item.getAttribute('data-id');
            title.value=item.getAttribute('data-title');
            year.value=item.getAttribute('data-year');
            price.value=item.getAttribute('data-price');
            tbGame.classList.remove('classShow');
            tbGame.classList.add('classHiden');
            editarGame.classList.remove('classHiden');
            editarGame.classList.add('classShow');
        }

        function UpdateGame(){

            let id=document.getElementById('idEdit');
            let title=document.getElementById('titleEdit');
            let year=document.getElementById('yearEdit');
            let price=document.getElementById('priceEdit');

            let game={           
                title:title.value,
                year:year.value,
                price:price.value
            }
           
           
            axios.put('http://localhost:8080/game/'+id.value,game,axiosConfig).then(result=>{
                //alert(result.statusText);
                ListGame();
                //tbody.removeChild
        }).catch(error=>{
                console.log(error)
        })
        tbGame.classList.add('classShow');
        tbGame.classList.remove('classHiden');
        editarGame.classList.add('classHiden');
        editarGame.classList.remove('classShow');

        }