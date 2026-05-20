const SUPABASE_URL =
"https://gdomsniafobyhlodcmnf.supabase.co";

const SUPABASE_KEY =
"sb_publishable_Dp8HKAN8AguzAVVhiWrpRw_BXbbk4by";

const supabaseClient =
supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ============================
// CARREGAR CLIENTES
// ============================

async function carregarClientes(){

  const { data, error } =
  await supabaseClient
  .from("usuarios")
  .select("*")
  .order("id", { ascending:false });

  if(error){

    alert(error.message);
    return;
  }

  const clientes =
  document.getElementById("clientes");

  clientes.innerHTML = "";

  data.forEach(cliente => {

    const hoje =
    new Date();

    let atrasado = false;

    if(cliente.vencimento){

      const vencimento =
      new Date(cliente.vencimento);

      atrasado =
      hoje > vencimento;
    }

    let statusHTML = "";

    if(cliente.ativo === false){

      statusHTML = `
        <span class="bloqueado">
          CLIENTE BLOQUEADO
        </span>
      `;

    } else if(atrasado){

      statusHTML = `
        <span class="atrasado">
          MENSALIDADE ATRASADA
        </span>
      `;

    } else {

      statusHTML = `
        <span class="ativo">
          EM DIA
        </span>
      `;
    }

    clientes.innerHTML += `

      <div class="cliente">

        <div class="info">

          <h3>

  <span class="${
    cliente.online
    ? 'status-online'
    : 'status-offline'
  }"></span>

  ${cliente.nome}

</h3>

          <small>
            ${cliente.telefone}
          </small>

          <br><br>

          <small>

            Vencimento:
            ${cliente.vencimento || "Não definido"}

          </small>

          ${statusHTML}

        </div>

        <div class="acoes">

          <button
            class="bloquear"
            onclick="bloquear(${cliente.id})"
          >

            Bloquear

          </button>

          <button
            class="liberar"
            onclick="liberar(${cliente.id})"
          >

            Liberar

          </button>

          <button
            class="renovar"
            onclick="renovar(${cliente.id})"
          >

            Renovar +30 Dias

          </button>

          <button
            class="apagar"
            onclick="deletar(${cliente.id})"
          >

            Apagar

          </button>

        </div>

      </div>

    `;
  });
}

// ============================
// BLOQUEAR
// ============================

async function bloquear(id){

  const { error } =
  await supabaseClient
  .from("usuarios")
  .update({
    ativo:false
  })
  .eq("id", id);

  if(error){

    alert(error.message);
    return;
  }

  carregarClientes();
}

// ============================
// LIBERAR
// ============================

async function liberar(id){

  const { error } =
  await supabaseClient
  .from("usuarios")
  .update({
    ativo:true
  })
  .eq("id", id);

  if(error){

    alert(error.message);
    return;
  }

  carregarClientes();
}

// ============================
// RENOVAR
// ============================

async function renovar(id){

  const novaData =
  new Date();

  novaData.setDate(
    novaData.getDate() + 30
  );

  const { error } =
  await supabaseClient
  .from("usuarios")
  .update({

    ativo:true,

    vencimento:novaData

  })
  .eq("id", id);

  if(error){

    alert(error.message);
    return;
  }

  carregarClientes();
}

// ============================
// DELETAR
// ============================

async function deletar(id){

  const confirmed = confirm("Tem certeza que deseja apagar este usuário?");

  if(!confirmed){
    return;
  }

  const senha = prompt("Digite a senha para apagar o usuário:");

  if(senha !== "123"){
    alert("Senha incorreta. A exclusão foi cancelada.");
    return;
  }

  const { error } =
  await supabaseClient
  .from("usuarios")
  .delete()
  .eq("id", id);

  if(error){

    alert(error.message);
    return;
  }

  carregarClientes();
}

carregarClientes();
async function ficarOnline(){

  await supabaseClient
  .from("usuarios")
  .update({
    online:true
  })
  .eq("id", usuarioLogado.id);

}

ficarOnline();
window.addEventListener("beforeunload", async ()=>{

  await supabaseClient
  .from("usuarios")
  .update({
    online:false
  })
  .eq("id", usuarioLogado.id);

});