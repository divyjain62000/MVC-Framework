# MVC-Framework
This is client side framework.Using this framework one create single page web-application with MVC.Framework help to make page dynamic frame also have feature like data binding.

MVC Stands for:
* M - Model
* V - View
* C - Controller

## Features of framework:
* Data-binding − Data binding helps in synchronization of data between model and view components.
* Controller − Controller helps to bind functions to a particular scope.
* Routing − It is concept of switching between different views.
* Expression evaluation - User can write any expression in {{ }}

## Steps to use this framework:

First download a framework.js file and include in your page
````
<script src='js/framework.js'></script>
````


````
function populateDS()
{
var c=new Customer();
djmvc.model=c.ds;
djmvc.controller=c;
}
window.addEventListener('load',populateDS);
````
