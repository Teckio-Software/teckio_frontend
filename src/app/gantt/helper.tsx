// import { endOfDay, format, isValid, parse, startOfDay, startOfMinute } from "date-fns";
// import { Task, TaskOrEmpty } from "./src";
// import { GanttData } from "./service/api/ganttService";
// import { useEffect, useState } from "react";


// const dateFormat = "dd/MM/yyyy HH:mm";

// export function initTasks() {
//   const [actividades, setActividades] = useState([ ]);
//   console.log("Actividadesssssssssssssssssss", actividades);
//   const currentDate = new Date();
//   let programacionEstimada: Task[] = [];
  
//   const getProgramaciones = async () => {
//     GanttData()
//       .then((response) => {
//         setActividades(response);
//         programacionEstimada = response;
//         programacionEstimada.forEach(element => {
//           element.start = new Date(element.start);
//           element.end = new Date(element.end);
//         });
//         console.log("Actividades", programacionEstimada);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   useEffect(() => {
//     getProgramaciones();
    
//   }, []);

//   const tasks: Task[] = [
//     {
//       start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
//       end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
//       name: "Some Project",
//       id: "ProjectSample",
//       progress: 25,
//       codigo: "123",
//       descripcion: "Descripcion de la tarea",
//       type: "project",
//       hideChildren: false,
//     },
//     {
//       start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
//       end: new Date(
//         currentDate.getFullYear(),
//         currentDate.getMonth(),
//         2,
//         12,
//         28
//       ),
//       name: "Idea",
//       id: "Idea",
//       codigo: "123ñlsdfjkdsklfj",
//       progress: 45,
//       type: "task",
//       parent: "ProjectSample",
//     },
//     {
//       start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
//       end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
//       name: "Research",
//       id: "Research",
//       progress: 25,
//       dependencies: [
//         {
//           sourceId: "Idea",
//           sourceTarget: "endOfTask",
//           ownTarget: "startOfTask",
//         },
//       ],
//       type: "task",
//       parent: "ProjectSample",
//     },
//     {
//       start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
//       end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
//       name: "Discussion with team",
//       id: "Discussion",
//       progress: 10,
//       dependencies: [
//         {
//           sourceId: "Research",
//           sourceTarget: "endOfTask",
//           ownTarget: "startOfTask",
//         },
//       ],
//       type: "task",
//       parent: "ProjectSample",
//     },
//     {
//       start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
//       end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10, 0, 0),
//       name: "Developing",
//       id: "developing",
//       progress: 50,
//       dependencies: [
//         {
//           sourceId: "Discussion",
//           sourceTarget: "endOfTask",
//           ownTarget: "startOfTask",
//         },
//       ],
//       type: "task",
//       parent: "ProjectSample",
//     },
//     {
//       start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
//       end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9),
//       name: "Code",
//       id: "code",
//       codigo: "123",
//       type: "task",
//       progress: 40,
//       parent: "developing",
//     },
//     {
//       start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
//       end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9),
//       name: "Frontend",
//       id: "frontend",
//       type: "task",
//       progress: 40,
//       parent: "code",
//     },
//     {
//       start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
//       end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9),
//       name: "Backend",
//       id: "backend",
//       type: "task",
//       progress: 40,
//       parent: "code",
//       dependencies: [
//         {
//           sourceId: "frontend",
//           sourceTarget: "endOfTask",
//           ownTarget: "startOfTask",
//         },
//       ],
//     },
//     {
//       start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
//       end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
//       name: "Review",
//       id: "review",
//       type: "task",
//       progress: 70,
//       parent: "developing",
//     },
//     {
//       start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
//       end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
//       name: "Release",
//       id: "release",
//       progress: currentDate.getMonth(),
//       type: "milestone",
//       dependencies: [
//         {
//           sourceId: "review",
//           sourceTarget: "endOfTask",
//           ownTarget: "startOfTask",
//         },
//       ],
//       parent: "ProjectSample",
//     },
//     // {
//     //   start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
//     //   end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
//     //   name: "Party Time",
//     //   id: "party",
//     //   progress: 0,
//     //   isDisabled: true,
//     //   type: "task",
//     // },
//     { 
//       id:	"2",
//       name:	"Padre",
//       idProyecto:	10028,
//       idPrecioUnitario:	10047,
//       cantidad:	1,
//       tipoPrecioUnitario:	0,
//       idConcepto:	10047,
//       codigo	:"Padre",
//       descripcion:	"Padre",
//       costoUnitario:	0,
//       importe	:0,
//       start:	new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
//       end	:new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
//       duracion:	1,
//       progress:	90,
//       comando	:0,
//       desfaseComando:	0,
//       // parent:	"0",
//       type:	"project"
//     }
    
//   ];

//   // return programacionEstimada.map((task) => ({
//   //   ...task,
//   //   end: endOfDay(task.end),
//   //   start: startOfDay(task.start),
//   // }));

//   console.log("EFE", actividades);
//   return tasks  .map((task) => ({
//     ...task,
//     end: endOfDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), 18)),
//     start: startOfDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), 19)),
//   }));
// }

// export const getTaskFields = (initialValues: {
//   name?: string;
//   start?: Date | null;
//   end?: Date | null;
// }) => {
//   const name = prompt("Name", initialValues.name);

//   const startDateStr = prompt(
//     "Start date",
//     initialValues.start ? format(initialValues.start, dateFormat) : "",
//   ) || "";

//   const startDate = startOfMinute(parse(startDateStr, dateFormat, new Date()));

//   const endDateStr = prompt(
//     "End date",
//     initialValues.end ? format(initialValues.end, dateFormat) : "",
//   ) || "";

//   const endDate = startOfMinute(parse(endDateStr, dateFormat, new Date()));

//   return {
//     name,
//     start: isValid(startDate) ? startDate : null,
//     end: isValid(endDate) ? endDate : null,
//   };
// };

// export const onAddTask = (parentTask: Task) => {
//   const taskFields = getTaskFields({
//     start: parentTask.start,
//     end: parentTask.end,
//   });

//   const nextTask: TaskOrEmpty = (taskFields.start && taskFields.end)
//     ? {
//       type: "task",
//       start: taskFields.start,
//       end: taskFields.end,
//       comparisonLevel: parentTask.comparisonLevel,
//       id: String(Date.now()),
//       name: taskFields.name || "",
//       progress: 0,
//       parent: parentTask.id,
//       styles: parentTask.styles,
//     }
//     : {
//       type: "empty",
//       comparisonLevel: parentTask.comparisonLevel,
//       id: String(Date.now()),
//       name: taskFields.name || "",
//       parent: parentTask.id,
//       styles: parentTask.styles,
//     };

//   return Promise.resolve(nextTask);
// };

// export const onEditTask = (task: TaskOrEmpty) => {
//   const taskFields = getTaskFields({
//     name: task.name,
//     start: task.type === "empty" ? null : task.start,
//     end: task.type === "empty" ? null : task.end,
//   });

//   const nextTask: TaskOrEmpty = (task.type === "task" || task.type === "empty")
//     ? (taskFields.start && taskFields.end)
//       ? {
//         type: "task",
//         start: taskFields.start,
//         end: taskFields.end,
//         comparisonLevel: task.comparisonLevel,
//         id: task.id,
//         name: taskFields.name || task.name,
//         progress: task.type === "empty"
//           ? 0
//           : task.progress,
//         dependencies: task.type === "empty"
//           ? undefined
//           : task.dependencies,
//         parent: task.parent,
//         styles: task.styles,
//         isDisabled: task.isDisabled,
//       }
//       : {
//         type: "empty",
//         comparisonLevel: task.comparisonLevel,
//         id: task.id,
//         name: taskFields.name || task.name,
//         parent: task.parent,
//         styles: task.styles,
//         isDisabled: task.isDisabled,
//       }
//     : {
//       ...task,
//       name: taskFields.name || task.name,
//       start: taskFields.start || task.start,
//       end: taskFields.end || task.end,
//     };

//   return Promise.resolve(nextTask);
// };
