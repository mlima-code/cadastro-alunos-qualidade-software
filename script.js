const form = document.getElementById("formAluno");
const tabela = document.getElementById("tabelaAlunos");
const msg = document.getElementById("mensagem");

let alunos = [];
let editandoIndex = null;

window.onload = function(){
const dados = localStorage.getItem("alunos");

if(dados){
alunos = JSON.parse(dados);
atualizarTabela();
}
};

form.addEventListener("submit",function(e){
e.preventDefault();

const nome = document.getElementById("nome");
const matricula = document.getElementById("matricula");
const email = document.getElementById("email");
const turma = document.getElementById("turma");

limparErros();

if(!nome.value || !matricula.value || !email.value || !turma.value){
mostrarErro("Preencha todos os campos.");
marcarCamposVazios([nome,matricula,email,turma]);
return;
}

const nomeLimpo = nome.value.trim();

if(nomeLimpo.split(" ").length < 2){
mostrarErro("Digite nome e sobrenome.");
nome.classList.add("erro");
return;
}

if(!/^\d{4}$/.test(matricula.value)){
mostrarErro("Matrícula deve ter 4 números.");
matricula.classList.add("erro");
return;
}

if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){
mostrarErro("E-mail inválido.");
email.classList.add("erro");
return;
}

const duplicado = alunos.some((a,i)=>
a.matricula === matricula.value && i !== editandoIndex
);

if(duplicado){
mostrarErro("Matrícula já cadastrada.");
matricula.classList.add("erro");
return;
}

const aluno = {
nome:nomeLimpo,
matricula:matricula.value,
email:email.value,
turma:turma.value
};

if(editandoIndex !== null){
alunos[editandoIndex] = aluno;
editandoIndex = null;
mostrarSucesso("Aluno atualizado com sucesso.");
}else{
alunos.push(aluno);
mostrarSucesso("Aluno cadastrado com sucesso.");
}

salvarDados();
atualizarTabela();
form.reset();
});

function atualizarTabela() {
tabela.innerHTML = "";

alunos.forEach((aluno, index) => {

const linha = document.createElement("tr");

linha.innerHTML = `
<td>${aluno.nome}</td>
<td>${aluno.matricula}</td>
<td>${aluno.email}</td>
<td>
<span class="badge turma-${aluno.turma}">
${aluno.turma}
</span>
</td>
<td>
<button class="btn-icon btn-editar" onclick="editar(${index})">
✏️
</button>
<button class="btn-icon btn-excluir" onclick="remover(${index})">
🗑️
</button>
</td>
`;

tabela.appendChild(linha);
});

document.getElementById("contador").textContent =
alunos.length + " registros";
}

function editar(index){
const aluno = alunos[index];

document.getElementById("nome").value = aluno.nome;
document.getElementById("matricula").value = aluno.matricula;
document.getElementById("email").value = aluno.email;
document.getElementById("turma").value = aluno.turma;

editandoIndex = index;

mostrarSucesso("Editando aluno...");
}

function remover(index){
if(confirm("Deseja excluir este aluno?")){
alunos.splice(index,1);
salvarDados();
atualizarTabela();
mostrarSucesso("Aluno removido.");
}
}

function salvarDados(){
localStorage.setItem("alunos",JSON.stringify(alunos));
}

function mostrarErro(texto){
msg.textContent = texto;
msg.className = "erro-msg";
}

function mostrarSucesso(texto){
msg.textContent = texto;
msg.className = "sucesso";
}

function limparErros(){
msg.textContent="";
msg.className="";

document.querySelectorAll("input,select").forEach(c=>{
c.classList.remove("erro");
});
}

function marcarCamposVazios(campos){
campos.forEach(c=>{
if(!c.value){
c.classList.add("erro");
}
});
}