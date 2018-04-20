import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { Storage } from '@ionic/storage';

/* Gerencia (adiciona, remove, atualiza) a lista de tarefas
 * referentes a um dia.
 */
@Injectable()
export class Task {

  constructor(public storage: Storage) {}

  /* Retorna lista completa de atividades de um dia.
   */
  public getAll(day_id) {
    return this.storage.get(day_id);
  }

  /* Adiciona uma item a lista. Caso lista não exista
   * será criada e o item adicionado.
   */ 
  public add(day_id, item) {
    return this.getAll(day_id)
      .then((data:any) => {
        data = data ? data : [];
        if(Array.isArray(item)) { // Lista de items
          for(let i=0; i<item.length;i++) {
            item[i]._id = this.generateItemIdentifier();
            data.push(item[i]);
          }
        } else {
          item._id = this.generateItemIdentifier();
          data.push(item);
        }
        return this.storage.set(day_id, data);
      })
  }

  /* Sobrescreve um item da lista do dia 'day_id'.
   * Identifica item pelo valor de '_id', caso item
   * não seja encontrado retorna null.
   */
  public update(day_id, item) {
    return this.getAll(day_id)
      .then((data) => {
        if(data) {
          let findById = (elm, idx, arr) => {
            return elm._id == item._id;
          };
          let index = data.findIndex(findById);
          if(data[index] !== undefined) {
            data[index] = item;
            return this.storage.set(day_id, data);
          }        
        }
        return null;
      });
  }

  /* Remove um item da lista 'day_id', caso item
   * não encontrado retorna null. Itens são identificados
   * pelo atributo '_id'.
   */
  public delete(day_id, item) {
    return this.getAll(day_id).then((data) => {
      if(data) {
        let findById = (elm, idx, arr) => {
          return elm._id == item._id;
        };
        let index = data.findIndex(findById);
        data.splice(index, 1);
        return this.storage.set(day_id, data);
      }
      return null;
    });
  }

  /* Gera uma string concatenando a data atual (com milisegundos) 
   * e um inteiro aleatório entre 0 e 999;
   */
  private generateItemIdentifier() {
    return DateTime.local().toISOTime() + '|' +
           Math.round(Math.random() * 1000);
  }

}
