import { render, screen } from "@testing-library/react"
import { assert, describe, expect, it } from "vitest"
import Users from "../modules/Users/Users"

it('Gets a list of users', async () => {
    render(<Users />)
    var counta = await screen.getByText(/\d+/)
    screen.debug(counta)
    assert(screen.getByText(/Users/))

})


//Get list of users

//dont create invalid user
//create valid user
//created user added to list
//edit user
//delete user