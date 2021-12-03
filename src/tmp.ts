import { DockerfileParser } from "./main";
let dockerfile = DockerfileParser.parse("R\\ \n\n");
console.log(dockerfile.getInstructions()[0].getRange());