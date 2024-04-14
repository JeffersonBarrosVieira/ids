const form = document.getElementById('formulario')
const btn_form = document.getElementById('btn-formulario')

const campo1 = document.getElementById('campo1')
const campo2 = document.getElementById('campo2')
const tempo = document.getElementById('tempo')

const soma = document.getElementById('soma')

// form.addEventListener('submit', e => {
//     e.preventDefault()
// })

btn_form.addEventListener('click', event => {
    event.preventDefault();

    if(campo1.value != '' && campo2.value != '' && tempo.value != ''){
        var url = '/calc'
        var data = {
            numeros: [
                campo1.value,
                campo2.value,
            ],
            tempo: tempo.value
        }
        
        fetch(url, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(function(resp){
            if(!resp.ok){
                throw new Error('Erro na requisição: ', resp.status);
            }
            return resp.json()
        }).then(function(resp){
            set_sum(resp, tempo.value)
        }).catch(function(error){
            console.log(error);
        })
    }
})

function set_sum(resp, temp){
    soma.innerHTML = `<br><h4>A soma é ${resp} e demorou ${temp} s para finalizar</h4>`
}