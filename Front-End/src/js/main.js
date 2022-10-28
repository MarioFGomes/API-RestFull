        let ul=document.querySelector('ul');
        
        let form1=document.getElementById('form1');

        let form2=document.getElementById('form2');

        let games;


        let axiosConfig={
            headers:{
                Authorization: "Bearer "+localStorage.getItem("token")
            }
        }


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

            }).catch(error=>{
                alert(error);
            })
        }

        axios.get('http://localhost:8080/games',axiosConfig).then(response=>{
            games=response.data.games
            games.forEach(element => {
                let item=document.createElement('li')
                item.innerHTML=`<strong>ID</strong>:${element.id} - <strong>Title</strong>:${element.title} - <strong>Ano</strong>:${element.year} - <strong>Preço</strong>:${element.price} </strong> <br>`
                item.setAttribute("data-id",element.id);
                item.setAttribute("data-title",element.title);
                item.setAttribute("data-year",element.year);
                item.setAttribute("data-price",element.price);

                let btn=document.createElement('button')
            btn.innerHTML="Deletar"

            let btnEdit=document.createElement('button')
            btnEdit.innerHTML="Editar"

            item.appendChild(btn);
            item.appendChild(btnEdit);
            ul.appendChild(item)

            btn.addEventListener("click",()=>{
                let id=item.getAttribute("data-id");
                DeleteGame(id);
            })
            

            btnEdit.addEventListener("click",()=>{
                LoadListItem(item);
            })
            });
        }).catch(error=>{
            console.log(error)
        });

        form1.addEventListener('submit',(e)=>{
            e.preventDefault();
            createGame();
            
        })

        form2.addEventListener('submit',(e)=>{
            e.preventDefault();
            UpdateGame();
            
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
                alert(result.statusText);
        }).catch(error=>{
                console.log(error)
        })
            
        }

        function DeleteGame(id){
        axios.delete('http://localhost:8080/game/'+id,axiosConfig).then(result=>{
            console.log(result)
        }).catch(error=>{
            console.log(error);
        })

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
                alert(result.statusText);
        }).catch(error=>{
                console.log(error)
        })
        }