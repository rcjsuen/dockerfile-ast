/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from 'assert';
import { Position } from 'vscode-languageserver-types';

import { assertRange } from './util';
import { DockerfileParser } from '../src/main';

describe("Argument", () => {
    it("getValue", () => {
        let dockerfile = DockerfileParser.parse("RUN npm install");
        let args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 2);
        assert.equal(args[0].getValue(), "npm");
        assert.equal(args[1].getValue(), "install");

        dockerfile = DockerfileParser.parse("EXPOSE 80\\\n00 8001");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 2);
        assert.equal(args[0].getValue(), "8000");
        assert.equal(args[1].getValue(), "8001");

        dockerfile = DockerfileParser.parse("EXPOSE 8000\\\n 8001");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 2);
        assert.equal(args[0].getValue(), "8000");
        assert.equal(args[1].getValue(), "8001");

        dockerfile = DockerfileParser.parse("EXPOSE 80\\ 81");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 2);
        assert.equal(args[0].getValue(), "80");
        assert.equal(args[1].getValue(), "81");

        dockerfile = DockerfileParser.parse("EXPOSE \\ 8000");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 1);
        assert.equal(args[0].getValue(), "8000");

        dockerfile = DockerfileParser.parse("SHELL [ \"a\\ b\" ]");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 4);
        assert.equal(args[0].getValue(), "[");
        assert.equal(args[1].getValue(), "\"a");
        assert.equal(args[2].getValue(), "b\"");
        assert.equal(args[3].getValue(), "]");

        dockerfile = DockerfileParser.parse("EXPOSE \\a");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 1);
        assert.equal(args[0].getValue(), "a");

        dockerfile = DockerfileParser.parse("EXPOSE 80\\81");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 1);
        assert.equal(args[0].getValue(), "8081");

        dockerfile = DockerfileParser.parse("ENV var=value\nRUN echo $var");
        args = dockerfile.getInstructions()[1].getExpandedArguments();
        assert.equal(args.length, 2);
        assert.equal(args[0].getValue(), "echo");
        assert.equal(args[1].getValue(), "value");

        dockerfile = DockerfileParser.parse("ENV var=value\nRUN echo $var$var2");
        args = dockerfile.getInstructions()[1].getExpandedArguments();
        assert.equal(args.length, 2);
        assert.equal(args[0].getValue(), "echo");
        assert.equal(args[1].getValue(), "value$var2");

        dockerfile = DockerfileParser.parse("ARG var=value\nRUN echo $var$var2");
        args = dockerfile.getInstructions()[1].getExpandedArguments();
        assert.equal(args.length, 2);
        assert.equal(args[0].getValue(), "echo");
        assert.equal(args[1].getValue(), "value$var2");

        dockerfile = DockerfileParser.parse("RUN echo $var$var2\nARG var=value\nENV var=value2");
        args = dockerfile.getInstructions()[0].getExpandedArguments();
        assert.equal(args.length, 2);
        assert.equal(args[0].getValue(), "echo");
        assert.equal(args[1].getValue(), "$var$var2");

        dockerfile = DockerfileParser.parse("ENV var=value \\ \t\r\n var2=value2");
        args = dockerfile.getInstructions()[0].getExpandedArguments();
        assert.equal(args.length, 2);
        assert.equal(args[0].getValue(), "var=value");
        assert.equal(args[1].getValue(), "var2=value2");

        dockerfile = DockerfileParser.parse("FROM alpine \\\n # comment");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 1);
        assert.equal(args[0].getValue(), "alpine");

        dockerfile = DockerfileParser.parse("FROM alpine \\\n # comment \n AS stage");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 3);
        assert.equal(args[0].getValue(), "alpine");
        assert.equal(args[1].getValue(), "AS");
        assert.equal(args[2].getValue(), "stage");
    });

    it("getRawValue", () => {
        let dockerfile = DockerfileParser.parse("RUN npm install");
        let args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 2);
        assert.equal(args[0].getRawValue(), "npm");
        assert.equal(args[1].getRawValue(), "install");

        dockerfile = DockerfileParser.parse("EXPOSE 80\\\n00 8001");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 2);
        assert.equal(args[0].getRawValue(), "80\\\n00");
        assert.equal(args[1].getRawValue(), "8001");

        dockerfile = DockerfileParser.parse("EXPOSE 8000\\\n 8001");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 2);
        assert.equal(args[0].getRawValue(), "8000");
        assert.equal(args[1].getRawValue(), "8001");

        dockerfile = DockerfileParser.parse("EXPOSE 80\\ 81");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 2);
        assert.equal(args[0].getRawValue(), "80");
        assert.equal(args[1].getRawValue(), "81");

        dockerfile = DockerfileParser.parse("EXPOSE \\ 8000");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 1);
        assert.equal(args[0].getRawValue(), "8000");

        dockerfile = DockerfileParser.parse("SHELL [ \"a\\ b\" ]");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 4);
        assert.equal(args[0].getRawValue(), "[");
        assert.equal(args[1].getRawValue(), "\"a");
        assert.equal(args[2].getRawValue(), "b\"");
        assert.equal(args[3].getRawValue(), "]");

        dockerfile = DockerfileParser.parse("EXPOSE \\a");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 1);
        assert.equal(args[0].getRawValue(), "\\a");

        dockerfile = DockerfileParser.parse("EXPOSE 80\\81");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 1);
        assert.equal(args[0].getRawValue(), "80\\81");

        dockerfile = DockerfileParser.parse("ENV var=value\nRUN echo $var");
        args = dockerfile.getInstructions()[1].getExpandedArguments();
        assert.equal(args.length, 2);
        assert.equal(args[0].getRawValue(), "echo");
        assert.equal(args[1].getRawValue(), "$var");

        dockerfile = DockerfileParser.parse("ENV var=value\nRUN echo $var$var2");
        args = dockerfile.getInstructions()[1].getExpandedArguments();
        assert.equal(args.length, 2);
        assert.equal(args[0].getRawValue(), "echo");
        assert.equal(args[1].getRawValue(), "$var$var2");

        dockerfile = DockerfileParser.parse("ARG var=value\nRUN echo $var$var2");
        args = dockerfile.getInstructions()[1].getExpandedArguments();
        assert.equal(args.length, 2);
        assert.equal(args[0].getRawValue(), "echo");
        assert.equal(args[1].getRawValue(), "$var$var2");

        dockerfile = DockerfileParser.parse("RUN echo $var$var2\nARG var=value\nENV var=value2");
        args = dockerfile.getInstructions()[0].getExpandedArguments();
        assert.equal(args.length, 2);
        assert.equal(args[0].getRawValue(), "echo");
        assert.equal(args[1].getRawValue(), "$var$var2");

        dockerfile = DockerfileParser.parse("ENV var=value \\ \t\r\n var2=value2");
        args = dockerfile.getInstructions()[0].getExpandedArguments();
        assert.equal(args.length, 2);
        assert.equal(args[0].getRawValue(), "var=value");
        assert.equal(args[1].getRawValue(), "var2=value2");

        dockerfile = DockerfileParser.parse("FROM alpine \\\n # comment");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 1);
        assert.equal(args[0].getRawValue(), "alpine");

        dockerfile = DockerfileParser.parse("FROM alpine \\\n # comment \n AS stage");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(args.length, 3);
        assert.equal(args[0].getRawValue(), "alpine");
        assert.equal(args[1].getRawValue(), "AS");
        assert.equal(args[2].getRawValue(), "stage");
    });

    it("getRange", () => {
        let dockerfile = DockerfileParser.parse("RUN npm install");
        let args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(2, args.length);
        assertRange(args[0].getRange(), 0, 4, 0, 7);
        assertRange(args[1].getRange(), 0, 8, 0, 15);

        dockerfile = DockerfileParser.parse("EXPOSE 80\\\n00 8001");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(2, args.length);
        assertRange(args[0].getRange(), 0, 7, 1, 2);
        assertRange(args[1].getRange(), 1, 3, 1, 7);

        dockerfile = DockerfileParser.parse("EXPOSE 8000\\\n 8001");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(2, args.length);
        assertRange(args[0].getRange(), 0, 7, 0, 11);
        assertRange(args[1].getRange(), 1, 1, 1, 5);

        dockerfile = DockerfileParser.parse("EXPOSE 80\\ 81");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(2, args.length);
        assertRange(args[0].getRange(), 0, 7, 0, 9);
        assertRange(args[1].getRange(), 0, 11, 0, 13);

        dockerfile = DockerfileParser.parse("EXPOSE \\ 8000");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(1, args.length);
        assertRange(args[0].getRange(), 0, 9, 0, 13);

        dockerfile = DockerfileParser.parse("SHELL [ \"a\\ b\" ]");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(4, args.length);
        assertRange(args[0].getRange(), 0, 6, 0, 7);
        assertRange(args[1].getRange(), 0, 8, 0, 10);
        assertRange(args[2].getRange(), 0, 12, 0, 14);
        assertRange(args[3].getRange(), 0, 15, 0, 16);

        dockerfile = DockerfileParser.parse("EXPOSE \\a");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(1, args.length);
        assertRange(args[0].getRange(), 0, 7, 0, 9);

        dockerfile = DockerfileParser.parse("EXPOSE 80\\81");
        args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(1, args.length);
        assertRange(args[0].getRange(), 0, 7, 0, 12);

        dockerfile = DockerfileParser.parse("ENV var=value\nRUN echo $var");
        args = dockerfile.getInstructions()[1].getExpandedArguments();
        assert.equal(2, args.length);
        assertRange(args[0].getRange(), 1, 4, 1, 8);
        assertRange(args[1].getRange(), 1, 9, 1, 13);

        dockerfile = DockerfileParser.parse("ENV var=value\nRUN echo $var$var2");
        args = dockerfile.getInstructions()[1].getExpandedArguments();
        assert.equal(2, args.length);
        assertRange(args[0].getRange(), 1, 4, 1, 8);
        assertRange(args[1].getRange(), 1, 9, 1, 18);
    });

    it("isBefore", () => {
        let dockerfile = DockerfileParser.parse("\nRUN npm install\n");
        let args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(2, args.length);
        assert.equal(args[0].isBefore(Position.create(0, 0)), false);
        assert.equal(args[0].isBefore(Position.create(1, 1)), false);
        assert.equal(args[0].isBefore(Position.create(1, 10)), true);
        assert.equal(args[0].isBefore(Position.create(2, 0)), true);
    });

    it("isAfter", () => {
        let dockerfile = DockerfileParser.parse("\nRUN npm install\n");
        let args = dockerfile.getInstructions()[0].getArguments();
        assert.equal(2, args.length);
        assert.equal(args[0].isAfter(Position.create(0, 0)), true);
        assert.equal(args[0].isAfter(Position.create(1, 10)), false);
        assert.equal(args[1].isAfter(Position.create(1, 5)), true);
        assert.equal(args[0].isAfter(Position.create(2, 0)), false);
    });
});
