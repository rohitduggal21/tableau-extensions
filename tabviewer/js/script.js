window.nativeAlert = window.alert;
window.alert = function(val){console.log(val+' (alert disabled)');};

function getData(table,query,config){

  if (query.trim().length == 0)
  {
    document.getElementById("toast-content").innerHTML = "Query cannot be empty !!";
    const toast = new bootstrap.Toast(document.getElementById('liveToast'));
    toast.show()
  }
  else if (query.trim().toLowerCase().startsWith("update") || query.trim().toLowerCase().startsWith("delete") || query.trim().toLowerCase().startsWith("alter") || query.trim().toLowerCase().startsWith("create") || query.trim().toLowerCase().startsWith("drop"))
  {
    document.getElementById("toast-content").innerHTML = "Only SELECT Statements are allowed !!";
    const toast = new bootstrap.Toast(document.getElementById('liveToast'));
    toast.show()
  }
  else
  {

    if ("execute" in config){
      document.getElementById("execute").classList.add("disabled");
    }
    if ("download-csv" in config){
      document.getElementById("download-csv").classList.add("disabled");
    }
    document.getElementById(config['table']).classList.add("d-none");
    document.getElementById(config['error-1']).classList.add("d-none");
    document.getElementById(config['error-2']).classList.add("d-none");
    document.getElementById(config['init']).classList.add("d-none");
    document.getElementById(config['load']).classList.remove("d-none");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
                                  if (this.readyState == 1 || this.readyState == 2 || this.readyState == 3){

                                  }
                                  else if (this.readyState == 4 && this.status == 200) 
                                  { 
                                    let data = JSON.parse(xhttp.responseText);
                                    let placeholders = [];

                                    if (data['data'].length < 9)
                                    {
                                      for (let i = 1; i <= (9-data['data'].length); i++) 
                                        { 
                                          placeholders.push({});
                                        }
                                    }

                                    table.setData(data['data'].concat(placeholders));

                                    document.getElementById(config['load']).classList.add("d-none");
                                    document.getElementById(config['table']).classList.remove("d-none");
                                    if ("execute" in config){
                                      document.getElementById("execute").classList.remove("disabled");
                                    }
                                    if ("download-csv" in config){
                                      document.getElementById("download-csv").classList.remove("disabled");
                                    }

                                  }
                                  else if(this.readyState == 4 && this.status != 200){
                                    
                                    document.getElementById(config['load']).classList.add("d-none");
                                    document.getElementById(config['error-1']).classList.remove("d-none");
                                    document.getElementById(config['error-2']).classList.remove("d-none");
                                     if ("execute" in config){
                                      document.getElementById("execute").classList.remove("disabled");
                                    }
                                    if ("download-csv" in config){
                                      document.getElementById("download-csv").classList.add("disabled");
                                    }

                                  }
                              };
    xhttp.open("POST", "/getData", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({"query":query}));
  }
}

function initializeExtension()
{

  $(document).ready(function () {

    tableau.extensions.initializeAsync().then(function () {
      console.log("Extension Initialized");

      var main_table = new Tabulator("#example-table", 
                          {
                                autoColumns:true,
                                layout:"fitDataFill",
                                pagination:"local",
                                paginationSize:100,
                          });

      var list_table = new Tabulator("#list-table", 
                          {
                                autoColumns:true,
                                layout:"fitDataFill",
                                pagination:"local",
                                paginationSize:100,
                          });

      getData(
              list_table,
              "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'",
              {
                "table": "list-table",
                "error-1": "list-error-1",
                "error-2": "list-error-2",
                "load": "list-load",
                "init": "list-init"
              });

      document.getElementById("refresh").addEventListener("click", function(){
      getData(
              list_table,
              "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'",
              {
                "table": "list-table",
                "error-1": "list-error-1",
                "error-2": "list-error-2",
                "load": "list-load",
                "init": "list-init"
              });
      });

      document.getElementById("execute").addEventListener("click", function(){
      getData(
              main_table,
              document.getElementById('query').value.replace(";",""),
              {
                "table": "example-table",
                "error-1": "error-1",
                "error-2": "error-2",
                "load": "load",
                "init": "init",
                "execute": "null",
                "download-csv": "null"
              });
      });

      document.getElementById("download-csv").addEventListener("click", function(){
        main_table.download("csv", "data.csv");
      });      

    });
  }, function (err) {
    // Something went wrong in initialization.
    console.log('Error while Initializing: ' + err.toString());
  });
}
initializeExtension();