$(document).ready( function () {
    // DataTable
    // if ($('#bookDatatable').length) {
    //     $('#bookDatatable').DataTable();
    // }
    
    // Table Editing
    function setSelect() {
        $('.selectopt').hide()
        $('.selectoptbtn').hide()
        $('.editopt').hide()
        var status = $('.dropdown-item.active.text-white').text().trim()

        if (status == "View") {
            $('.selectopt').hide()
            $('.selectoptbtn').hide()
            $('.editopt').hide()
            return
        } else if (status == "Edit") {
            $('.selectopt').hide()
            $('.selectoptbtn').hide()
            $('.editopt').fadeIn()
        } else if (status == "Delete") {
            $('.selectopt').fadeIn()
            $('.selectoptbtn').fadeIn()
            $('.editopt').hide()
        }
        return
    }
    setSelect()
    $('.editinfo .dropdown-item').click(function(){
        $(this).parent().find('.dropdown-item.active.text-white').removeClass('active text-white')
        $(this).addClass('active text-white')
        setSelect()
    })

    if ($('table').length) {
        
        // UPDATE HANDLERS
        $('#updatebtn').click(()=>{
            var studentidno = $('#id').text().trim();
            fetch('/updatestudent', {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: studentidno,
                    name: $('#name').val(),
                    studentid: $('#studentid').val(),
                    libcardno: $('#libid').val(),
                    phoneno: $('#phoneno').val(),
                    feestats: $('#feestats').val() == 'Paid' ? true : false,
                })
            })
            .then(res => {
            if (res.ok) return res.json()
            })
            .then(response => {
                console.log(response)
                if (response == "Success") {
                    window.location.reload()
                    return;
                }
                console.log('Error')
                window.location.href = "../error";
            })
        })
    
        $('#assignbtn').click(()=>{
            // alert(moment().format($('#dateborrowed').val()).add(7, 'days'))
            fetch('/update', {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: $('#id').text().trim(),
                    books: [{
                        title: $('#booktitle').val(),
                        bookid: $('#booknum').val(),
                        // dateborrowed: $('#dateborrowed').val(),
                        dateborrowed: moment().format(),
                        returndate: moment().add(7, 'd').format(),
                        bookstats: $('#condition').val(),
                    }]
                })
            })
            .then(res => {
            if (res.ok) return res.json()
            })
            .then(response => {
                if (response == "Success") {
                    // console.log(response)
                    window.location.reload()
                    return;
                }
                console.log('Error')
                window.location.href = "../error";
            })
        })
    
        // DELETE HANDLERS
        $('#deleteall').click(()=>{
            alert('sds')
            
            fetch('/deleteall', {
                method: 'delete',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            })
            .then(res => {
            if (res.ok) return res.json()
            })
            .then(response => {
                if (response == "Success") {
                    console.log(response)
                    window.location.reload()
                    return;
                }
                console.log('Error')
                window.location.href = "./error";
            })
        })

        $('#deleteallbooks').click(()=>{
            fetch('/deletebooks', {
                method: 'delete',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: $('.userid').text().trim()
                })
            })
            .then(res => {
            if (res.ok) return res.json()
            })
            .then(response => {
                if (response == "Success") {
                    console.log(response)
                    window.location.reload()
                    return;
                }
                console.log('Error')
                window.location.href = "./error";
            })
        })

        var delArray = []
        $('.val_id').change(()=>{
            delArray = []
            document.querySelectorAll('.val_id:checked').forEach(element => {
                delArray.push($(element).parent().parent().parent().find('.uniqueid').text().trim())
            });
            console.log(delArray)
        })

        var delBooksArray = []
        $('.val_id').change(()=>{
            delBooksArray = []
            document.querySelectorAll('.val_id:checked').forEach(element => {
                delBooksArray.push($(element).parent().parent().parent().find('.uniqueid').text().trim())
            });
        })
        
        $('#deleteonebook').click(()=>{
            console.log('ArrayList:', delBooksArray)

            // fetch('/deleteone', {
            //     method: 'delete',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         ids: delArray
            //     })
            // })
            // .then(res => {
            // if (res.ok) return res.json()
            // })
            // .then(response => {
            //     if (response == "Success") {
            //         console.log(response)
            //         window.location.reload()
            //         return;
            //     }
            //     console.log('Error')
            //     window.location.href = "./error";
            // })
        })   

        $('#deleteone').click(()=>{
            fetch('/deleteone', {
                method: 'delete',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ids: delArray
                })
            })
            .then(res => {
            if (res.ok) return res.json()
            })
            .then(response => {
                if (response == "Success") {
                    console.log(response)
                    window.location.reload()
                    return;
                }
                console.log('Error')
                window.location.href = "./error";
            })
        })   

    }

    // VALIDATION
    if ($("form[name='create']").length) {
      // Wait for the DOM to be ready
      $(function () {
        // Initialize form validation on the registration form.
        // It has the name attribute "registration"
        $("form[name='create']").validate({
          // Specify validation rules
          rules: {
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are defined
            // on the right side
            name: "required",
            studentid: "required",
            phoneno: {
                required: true,
                minlength: 10
            },
            libid: "required",
            feestats: "required",
          },
          // Specify validation error messages
          messages: {
            name: "Please enter student's name",
            studentid: "Please enter stident's school ID number",
            libid: "Please enter student's library card number",
            phoneno: {
                required: "Please enter student's phone number",
                minlength: "The phone number has to have 10 digits"
            },
            feestats: "Please select student's fee status",
          },
          // Make sure the form is submitted to the destination defined
          // in the "action" attribute of the form when valid
          submitHandler: function (form) {
            form.submit();
          }
        });
      });
    }

    if ($("form[name='assign']").length) {
      // Wait for the DOM to be ready
      $(function () {
          console.log('sfsd');
        // Initialize form validation on the registration form.
        // It has the name attribute "registration"
        $("form[name='assign']").validate({
          // Specify validation rules
          rules: {
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are defined
            // on the right side
            booktitle: "required",
            booknum: "required",
          },
          // Specify validation error messages
          messages: {
            booktitle: "Please enter the book's title",
            booknum: "Please enter book number",
          },
          // Make sure the form is submitted to the destination defined
          // in the "action" attribute of the form when valid
          submitHandler: function (form) {
            form.submit();
          }
        });
      });
    }
});