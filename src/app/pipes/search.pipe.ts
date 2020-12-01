import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})


export class SearchPipe implements PipeTransform {
  transform(value: any, text?: string): unknown {
    if (!value) return null;
    if (!text) return value;
    text = text.toLowerCase();
    return value.filter(function (item) {
      let skills = item.skills;
      for(var i=0;i < skills.length; i++){
        if(skills[i].toLowerCase().includes(text)) return item;
      }
      let designation = item.designation.toLowerCase();
      if(designation.includes(text)) return item;
      for(var i=0; i < item.info.length;i++){
          if(item.info[i].value.toLowerCase().includes(text)) return item;
      }
      return null;
    });
  }
}