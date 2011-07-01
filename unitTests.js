        
        var acTests=null;
        window.onload = function()
        {
        acTests =  new tests();
        acTests.init();
        //setTimeout("acTests.test1()", 100);
        } 

        function dmessage( str )
        {
    		//console.log(str);
        	var dv = document.getElementById('_console_out');
        	if( dv){
        		dv.value = str + "\n"+ dv.value;
        	}
        }
function tests()
        {
        
            this.webSocket = null;
            this.dataCallback=null;

            this.init =  function()
            {
                dmessage( "tests init called");
                this.webSocket = new WebSocket('ws://127.0.0.1:9091');
                
                this.webSocket.onopen=function(evt){
                    if(this.dataCallback) this.dataCallback();
                	dmessage(" WEB SOCKET OPENED");
                	var dv = document.getElementById('_socket_status_div');
                	if( dv)
                		{
                		dv.innerHTML = "socket <b><font color='green'> Opened </font></b>"
                		
                		}

                }
                
                this.webSocket.onclose=function(evt){
                	dmessage("!!! WEB SOCKET CLOSED !!!");
                 	var dv = document.getElementById('_socket_status_div');
                	if( dv)
                		{
                		dv.innerHTML = "socket <font color='red'><b> CLOSED </b></font>"
                		
                		}
                }
                
                this.webSocket.onmessage=function(evt){
                    //dmessage( JSON.stringify(evt));
                    var msg=JSON.parse(evt.data);
                    console.log(msg);
                    if(acTests.dataCallback)
                    {
                    	acTests.dataCallback(msg.from,msg.title,msg.body);
                    }
                }
                
                this.webSocket.onerror=function(evt){
                }
                
                
               
            }
         
            this.checkConnection = function( passMsg, failMsg)
            {
             	
            	if(this.webSocket.readyState == 1)
            		dmessage(passMsg)
            	else
            		dmessage(failMsg);
            }
            this.test1 =  function()
            {
            	dmessage("___test1_____send random stuff with no one logged in");
        //send some stuff with no clients logged in
                    
            	if(!this.send(2))
            		dmessage("failed 1.1");
            	if(!this.send({s:12}))
            		dmessage("failed 1.2");
            	if(!this.send("heooo"))
            		dmessage("failed 1.3");
            	if(!this.send({s:"12", d:"34"}))
            		dmessage("failed 1.4");
                setTimeout("acTests.test1delay()", 400);

            }
            this.test1delay =  function()
            {
            	dmessage("___test1_b_____delayed random stuff");
                //send some stuff with no clients logged in
                            
                    	if(!this.send(2))
                    		dmessage("failed 1.1b");
                    	if(!this.send({s:12}))
                    		dmessage("failed 1.2b");
                    	if(!this.send("heooo"))
                    		dmessage("failed 1.3b");
                    	if(!this.send({s:"12", d:"34"}))
                    		dmessage("failed 1.4b");
            }
        
            this.test2 =  function()
            {

                this.dataCallback = function(to, cmd, body)
                {
                	
                	if(cmd == '/getClients')
                		{
                		 dmessage( body.length + ' connected clients');
                		}
                }
                //CONNECT 2 CLIENTS
                this.webSocket.send(JSON.stringify({"to":'',"title":'/connect',"body":new Array('poop') }) );
            	if(this.webSocket.readyState != 1)
            		dmessage("test 2.1 failed");
            	
            	this.webSocket.send(JSON.stringify({"to":'',"title":'/connect',"body":new Array('poop2') }) );
            	if(this.webSocket.readyState != 1)
            		dmessage("test 2.2 failed");
            
            	//duplicate second client
            	this.webSocket.send(JSON.stringify({"to":'',"title":'/connect',"body":new Array('poop2') }) );
            	if(this.webSocket.readyState != 1)
            		dmessage("test 2.3 failed");
           
            	this.webSocket.send(JSON.stringify({"to":'',"title":'/getClients',"body":'' }) );

                
            
                setTimeout("acTests.checkConnection('2 passed','2 failed')", 100);

            	
            }
        
            this.test3 = function()
            {
            	//send garbage with users logged in
            	this.webSocket.send(JSON.stringify({"to":'',"title":'/connect',"body":new Array('poop4') }) );
                
            	this.webSocket.send(JSON.stringify({"to":'',"title":'/connect    ',"body":new Array('poop5') }) );
            	this.webSocket.send(JSON.stringify({"to":'ddsf',"title":'/connect',"body":new Array('poop6') }) );
            	this.webSocket.send(JSON.stringify({"to":'',"title":'/connect',"body":123 }) );
            	
            	//this.webSocket.send(1234324213412341234123445465465746547657465476547654765476576547654 );
            	//this.webSocket.send( Number.MAX_VALUE);
            	//this.webSocket.send( Number.NaN);
                setTimeout("acTests.checkConnection('test 3 passed','test 3 failed')", 100);

            }

            this.test4 = function()
            {
            	this.webSocket.send(JSON.stringify({"to":'',"title":'/connect',"body":new Array('poop4test4') }) );
            	this.webSocket.send(1234324213412341234123445465465746547657465476547654765476576547654 );
            	this.webSocket.send( Number.MAX_VALUE);
            	this.webSocket.send( Number.NaN);//this crashes the node server
                setTimeout("acTests.checkConnection('test 4 passed','test 4 failed')", 100);
            }
            this.test5 = function()
            {
            	//disconnect a lot of times
            	this.webSocket.send(JSON.stringify({"to":'',"title":'/disconnect',"body":new Array() }) );
            	this.webSocket.send(JSON.stringify({"to":'',"title":'/disconnect',"body":new Array() }) );
            	this.webSocket.send(JSON.stringify({"to":'',"title":'/disconnect',"body":new Array() }) );
            	this.webSocket.send(JSON.stringify({"to":'',"title":'/disconnect',"body":new Array() }) );
            	this.webSocket.send(JSON.stringify({"to":'',"title":'/disconnect',"body":new Array() }) );
            	this.webSocket.send(JSON.stringify({"to":'',"title":'/disconnect',"body":new Array() }) );
            	this.webSocket.send(JSON.stringify({"to":'',"title":'/disconnect',"body":new Array() }) );
            	this.webSocket.send(JSON.stringify({"to":'',"title":'/disconnect',"body":new Array() }) );
            	this.webSocket.send(JSON.stringify({"to":'',"title":'/disconnect',"body":new Array() }) );
                setTimeout("acTests.checkConnection('test 5 passed','test 5 failed')", 100);
            }
            this.send = function( obj )
            {
               return( this.webSocket.send(JSON.stringify( obj) ));
            }
        }
 
        
