# ValidateLibary
ValidateForm
Use library
 validator({
            form: '#form-1',
            errorSelector: '.form-message',
            rules: [
            // add rule over here.
                validator.isRequired('#fullname'),
                validator.isEmail('#email'),
                validator.minLengthPassword('#password', 6),
            ]
        });
