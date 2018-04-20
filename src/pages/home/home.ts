import { Component, ViewChild } from '@angular/core';
import { IonicPage, 
         NavController, 
         AlertController, 
         Content } from 'ionic-angular';
import { Task } from '../../providers/task';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DateTime } from 'luxon';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('addButton', [
      state('inactive', style({ transform: 'rotate(0deg)', })),
      state('active', style({ transform: 'rotate(225deg)', fontSize: '2.2em', })),
      transition('inactive => active', animate('400ms ease-out')),
      transition('active => inactive', animate('400ms ease-out'))
    ]),
  ],
})
export class HomePage {
  @ViewChild(Content) content: Content;
  @ViewChild('addInput') addInput;

  public button_state: string = 'inactive';
  
  public lista_id: any;
  public tasks: any;
  
  public show_add_task: boolean = false;
  public show_add_alert: boolean = false;
  public new_task: any = {dia:null,hora:null,descricao:null,done:null};

  constructor(public navCtrl: NavController, public taskProvider: Task, public alertCtrl: AlertController) {
    DateTime.local().setZone('America/Sao_Paulo');
    
    this.lista_id = "lista-de-lembretes-TMZ";

    this.taskProvider.getAll(this.lista_id)
      .then(tasks => this.setTasksDate(tasks));
  }

  private setTasksDate(tasks) {
    for(let i = 0; i < tasks.length; i++) {
      if(tasks[i].dia) {
        let dia = tasks[i].dia;
        if(tasks[i].hora) {
          dia += 'T' + tasks[i].hora + ':00';
        }
        tasks[i].time = DateTime.fromISO(dia); 
      }
    }    
    this.tasks = tasks;
  }

  public addTask() {
    this.taskProvider.add(this.lista_id , this.new_task)
      .then(data => {
        this.setTasksDate(data);
        this.new_task = {dia:null,hora:null,descricao:null,done:null};
        this.toggleAddTask();
      }).catch(err => {
        this.toggleAddTask();
      });
  }

  public toggleDone(task) {
    task.done = !task.done;
    this.taskProvider.update(this.lista_id, task)
      .then(data => { 
        this.setTasksDate(data);
      })
      .catch(err => {
        console.log('[toggleDone]', err);
      })
  }

  public delete(task) {
    let confirm = this.alertCtrl.create({
      title: 'Excluir tarefa?',
      message: 'Confirma exclusão da tarefa <b>' + task.descricao + '</b>?',
      buttons: [{ text: 'Cancelar' },
        { text: 'Sim, excluir',
          handler: () => {
            this.taskProvider.delete(this.lista_id, task)
              .then(data => { this.setTasksDate(data); })
              .catch(err => { console.log('[delete.item]', err); })
          }
        }
      ]
    });
    confirm.present();
  }

  public toggleAddTask() {
    this.show_add_task = !this.show_add_task;
    this.button_state = this.show_add_task ? 'active' : 'inactive';
    if(this.show_add_task) {
      setTimeout(()=>{
        this.addInput.setFocus(); 
        setTimeout(()=>{
          this.content.scrollToBottom();
        }, 200);
      }, 200);
    }
  }

  public goToCalendar() {
    this.navCtrl.setRoot("CalendarPage");
  }

}
