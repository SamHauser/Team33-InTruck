import { fireEvent, render, screen, act } from "@testing-library/react"
import { assert, describe, expect, it } from "vitest"
import Users from "../modules/Users/Users"

it("doesn't create invalid users", async () => {
    render(<Users />)
    var createButton = await screen.findByText(/Create User/)
    act(() => {
        createButton.click()
    })

    var username = screen.getByLabelText(/Username/)
    var firstname = screen.getByLabelText(/First Name/)
    var surname = screen.getByLabelText(/Last Name/)
    var password = screen.getAllByLabelText(/Password/)

    console.log(password)

    var submitBtn = await screen.findByText(/SUBMIT/)

    act(() => {
        fireEvent.change(username, { target: { value: '' } })
        fireEvent.change(firstname, { target: { value: '' } })
        fireEvent.change(surname, { target: { value: '' } })
        // fireEvent.change(password, { target: { value: '' } })
        // fireEvent.change(confirmPassword, { target: { value: '' } })
    })


})

//Get list of users

//dont create invalid user
//create valid user
//created user added to list
//edit user
//delete user