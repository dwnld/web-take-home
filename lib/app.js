
/*
For React, add the following markup:

  <div id="container"></div>

And use following code:

import React from 'react'
import ReactDom from 'react-dom'

ReactDom.render(<p>Hello world</p>, document.getElementById('container'))

*/

/*
 For Angular, add the following markup
 <app></app>
 */

import angular from 'angular'

var app = angular.module('DWNLDTakeHome', [])
  .component('app', {
    template:`
      <!--<h1>{{$ctrl.title}}</h1>-->
      <app-body></app-body>
    `,
    // templateUrl:'/lib/temp.html',
    controller:[ function(){
      this.title = 'My App'
    }]
  })

app.component('appBody',{
  template:`
  <h3>{{ $ctrl.title }}</h3>
  <div class='message-list'>
  <ul>
  <li ng-repeat='message in $ctrl.messages' ng-click='$ctrl.selectMessage(message)'>
    <div>
    <h4>{{ message.subject }}</h4>
    </div>
    </li>
    </ul>
    </div>
    <div class='message-current' ng-if='$ctrl.curMessage'>
      <h3>{{ $ctrl.curMessage.subject }}</h3>
      <hr>
      <p> {{ $ctrl.curMessage.body }} </p>
    </div>
  `,
  controller:function( $interval, $http){
    var ctrl = this
    this.title = 'Dwnld Messenger'
    this.messages = []

    this.selectMessage = function(message){
      $http.get('/api/messages/' + message.id ).then( function(data){
        ctrl.curMessage = data.data
      })
    }

    $interval(function(){
      $http.get('/api/messages').then(function(data){
        ctrl.messages = data.data
      })
    }, 1000, 1);
  }
})

angular.bootstrap(document, ['DWNLDTakeHome']);


