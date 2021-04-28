var djmvc={
	model:null,
  controller:null
};

var htmlElementList=[];
var preservedInnerHTMLOfElements=[];


//common functions

function setAttributeValue(htmlElement,bindToAttribute,djmvc_attribute)
{
  if(djmvc_attribute!=null) eval("htmlElement."+bindToAttribute+"=djmvc.model."+djmvc_attribute);
}

function setModelKeyValue(element,bindToAttribute)
{
  djmvc.model[element.getAttribute("djmvc-attribute")]=eval("element."+bindToAttribute);
}







//configure elements of DOM
function confDOMElements()
{
let elementList=document.getElementsByTagName("*");
let elementListLength=elementList.length;
let htmlElement=null;
let htmlElementType="";
let tag="";

for(let i=0;i<elementListLength;i++)
{
 htmlElement=elementList[i];
 htmlElementType=htmlElement.getAttribute("type");
 tag=htmlElement.tagName;	

 if(tag.toUpperCase()=="INPUT" )
 {
  if(htmlElementType.toUpperCase()=="TEXT" || htmlElementType.toUpperCase()=="NUMBER" || htmlElementType.toUpperCase()=="PASSWORD")
  {
    htmlElement.oninput=function(){
    let bindToAttribute="value";
    if(this.hasAttribute("djmvc-bind-to")) bindToAttribute=this.getAttribute("djmvc-bind-to");
    setModelKeyValue(this,bindToAttribute);  
   };
  }else// (type=text or number or password related conf ends here)
  if(htmlElementType.toUpperCase()=="RADIO")
  {
    htmlElement.onchange=function(){
     let bindToAttribute="value";
     if(this.hasAttribute("djmvc-bind-to")) bindToAttribute=this.getAttribute("djmvc-bind-to");
     setModelKeyValue(this,bindToAttribute);  
    };
  }else
  if(htmlElementType.toUpperCase()=="CHECKBOX") 
  {
  	htmlElement.onchange=function(){
    let bindToAttribute="checked";
    if(this.hasAttribute("djmvc-bind-to")) bindToAttribute=this.getAttribute("djmvc-bind-to");
     setModelKeyValue(this,bindToAttribute);  
    };
  }
 }else		//tag=input  ends here
 if(tag.toUpperCase()=="SELECT")
 {
 	if(htmlElement.hasAttribute("multiple"))
    {
    	htmlElement.onchange=function(){
        if(this.hasAttribute("djmvc-bind-to")) 
        {
        	bindToAttribute=this.getAttribute("djmvc-bind-to");
        	setModelKeyValue(this,bindToAttribute);  
        }
        else
        {

           let selectedOptionsValue=[];
           for(let e=0;e<this.selectedOptions.length;e++)
           {
           	 selectedOptionsValue.push(this.selectedOptions[e].value);
           }
           djmvc.model[this.getAttribute("djmvc-attribute")]=selectedOptionsValue;   
        }
      };
    }    
    else
    {
    	htmlElement.onchange=function(){
         let bindToAttribute="value";
         if(this.hasAttribute("djmvc-bind-to")) bindToAttribute=this.getAttribute("djmvc-bind-to");
         setModelKeyValue(this,bindToAttribute);  
        };
    }
 }else    //tag=select related conf ends here
 if((tag.toUpperCase()=="H1" || tag.toUpperCase()=="H2" || tag.toUpperCase()=="H3" || tag.toUpperCase()=="H4" || tag.toUpperCase()=="H5" || tag.toUpperCase()=="H6" || tag.toUpperCase()=="DIV" || tag.toUpperCase()=="SPAN") && htmlElement.getAttribute("djmvc-if")==null)
 {
    tmpInnerHTML=htmlElement.innerHTML;
    tmpInnerHTMLLength=tmpInnerHTML.length;
    finalInnerHTML="";
    let y=-1;
    let t=-1;
    let key="";
    if(tmpInnerHTML.search("{{")!=-1 && tmpInnerHTML.search("}}")!=-1 )
    {
      for(let z=0;z<tmpInnerHTMLLength;z++)
      {
        y=tmpInnerHTML.indexOf("{{",z);
        if(y!=-1) t=tmpInnerHTML.indexOf("}}",y);
        if(y!=-1 && t!=-1)
        {
          finalInnerHTML+="'"+tmpInnerHTML.substr(z,y-z)+"'";
          y+=2;
          z=tmpInnerHTML.indexOf("}}",y);
          key=tmpInnerHTML.substr(y,z-y);
          z+=1;
          finalInnerHTML+="+eval('djmvc.model[\""+key+"\"]')+";
        }
        else
        {
          alert(tmpInnerHTMLLength-z);
          finalInnerHTML+="'"+tmpInnerHTML.substr(z,tmpInnerHTMLLength-z);
          z=tmpInnerHTMLLength;
        }

      }
      if(finalInnerHTML[finalInnerHTML.length-1]!="'") finalInnerHTML+="''";
      alert(finalInnerHTML);
      preservedInnerHTMLOfElements.push(finalInnerHTML);
    }

 }else
 if(tag.toUpperCase()=="BUTTON" && htmlElement.getAttribute("djmvc-click")!=null)
 {
   htmlElement.onclick=function(){
    let functionName=this.getAttribute("djmvc-click");
    eval("(djmvc.controller)."+functionName+"();");
   }
 }
if(htmlElement!=null) htmlElementList[i]=htmlElement;
}//for loop ends here

}//confDOMElements function ends here 



function updateDOMElements()
{
let htmlElementListLength=htmlElementList.length;
let htmlElement=null;
let htmlElementType="";
let tag="";
let djmvc_attribute="";
let t=0;
for(let i=0;i<htmlElementListLength;i++)
{
  htmlElement=htmlElementList[i];
  htmlElementType=htmlElement.getAttribute("type");
  tag=htmlElement.tagName;
  djmvc_attribute=htmlElement.getAttribute("djmvc-attribute");
  if(tag.toUpperCase()=="INPUT")
  {
   if(htmlElementType.toUpperCase()=="TEXT" || htmlElementType.toUpperCase()=="NUMBER" || htmlElementType.toUpperCase()=="PASSWORD")
   {
     let bindToAttribute="value";    
     if(htmlElement.hasAttribute("djmvc-bind-to")) bindToAttribute=htmlElement.getAttribute("djmvc-bind-to");
     setAttributeValue(htmlElement,bindToAttribute,djmvc_attribute);
   }else
   if(htmlElementType.toUpperCase()=="RADIO")
   {
   	  let bindToAttribute="value";    
      if(htmlElement.hasAttribute("djmvc-bind-to")) bindToAttribute=htmlElement.getAttribute("djmvc-bind-to");
      //alert(eval("djmvc.model."+djmvc_attribute+"==htmlElement."+bindToAttribute));
      if(bindToAttribute.toUpperCase()=="VALUE")
      {
      	if(eval("djmvc.model."+djmvc_attribute+"==htmlElement."+bindToAttribute)) htmlElement.checked=true;
      }
      else 
      {
      	setAttributeValue(htmlElement,bindToAttribute,djmvc_attribute);
      }
   }else
   if(htmlElementType.toUpperCase()=="CHECKBOX")
   {
      let bindToAttribute="checked";    
      if(htmlElement.hasAttribute("djmvc-bind-to")) bindToAttribute=htmlElement.getAttribute("djmvc-bind-to");
      htmlElement.checked=false;
      if(bindToAttribute.toUpperCase()=="CHECKED")
      {
      	if(eval("djmvc.model."+djmvc_attribute+"==true")) htmlElement.checked=true;
      }
      else 
      {
      	setAttributeValue(htmlElement,bindToAttribute,djmvc_attribute);
      }
   }

  }else		//tag=input  && (type=text or number or password related conf ends here)
  if(tag.toUpperCase()=="SELECT")
  {
    let bindToAttribute="value";    
    if(htmlElement.hasAttribute("multiple"))
    {
        if(htmlElement.hasAttribute("djmvc-bind-to")) 
        {
        	bindToAttribute=htmlElement.getAttribute("djmvc-bind-to");
        	setAttributeValue(htmlElement,bindToAttribute,djmvc_attribute);
        }
        else
        {
          let selectedOptionsValue=djmvc.model[djmvc_attribute];
          let indexList=[];
          let optionsLength=htmlElement.options.length;
          let selectedOptionsValueLength=selectedOptionsValue.length;
          for(let j=0;j<selectedOptionsValueLength;j++)
    	  {
    	  	 for(let k=0;k<optionsLength;k++)
    	  	 {
    	  	 	if(selectedOptionsValue[j]==htmlElement.options[k].value) indexList.push(k);
    	  	 }
    	  }
    	  for(let k=0;k<optionsLength;k++)
    	  {
    	  	 	htmlElement.options[k].selected=false;
    	  }
    	  let indexListLength=indexList.length;
   	      for(let j=0;j<indexListLength;j++)
    	  {
    		 htmlElement.options[indexList[j]].selected=true;
          }
        }
    }
    else
    {
    	setAttributeValue(htmlElement,bindToAttribute,djmvc_attribute);
    }

  }else		//tag=select related conf ends here
  if((tag.toUpperCase()=="H1" || tag.toUpperCase()=="H2" || tag.toUpperCase()=="H3" || tag.toUpperCase()=="H4" || tag.toUpperCase()=="H5" || tag.toUpperCase()=="H6" || tag.toUpperCase()=="DIV" || tag.toUpperCase()=="SPAN") && htmlElement.getAttribute("djmvc-if")==null)
   {
    if(htmlElement.innerHTML.search("{{")!=-1 && htmlElement.innerHTML.search("}}")!=-1 )
    {
    htmlElement.innerHTML=eval(preservedInnerHTMLOfElements[t]);  
    t++;
    }
    
  }else
  if((tag.toUpperCase()=="DIV" || tag.toUpperCase()=="SPAN") && htmlElement.getAttribute("djmvc-if")!=null)
  {

    if(eval('djmvc.model.'+htmlElement.getAttribute("djmvc-if"))) htmlElement.style.display="block";
    else htmlElement.style.display="none";
    
  }

}//for loop ends here
}//updateDOMElements function ends here 


setTimeout(confDOMElements,100);
setInterval(updateDOMElements,100);

