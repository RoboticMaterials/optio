import React, { useState } from 'react'

// functions external
import PropTypes from 'prop-types'

// Import Components
import TextField from '../../../../../../basic/form/text_field/text_field'
import Textbox from '../../../../../../basic/textbox/textbox'

import { Formik, Form } from 'formik'


// styles
import * as styled from "./pre_body_content.style"

const PreBodyContent = () => {

	const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

	return (
		<Formik
				initialValues={{
					email: email,
					password: password,
				}}
				initialTouched={{
					email: true,
					password: true,
				}}

				validateOnBlur={false}
				validateOnChange={false}

				onSubmit={async (values, { setSubmitting }) => {

					setSubmitting(true)
					// setLoading(true)

					// await handleSubmit(values)

					setSubmitting(false)
				}}

			>
	{(formikProps) => {

		return (
				<Form>
					<styled.Container>

						<h3> Sign into Shopify: </h3>

						<TextField
							name={"email"}
							placeholder='Enter Email'
							type='text'
							InputComponent={Textbox}
							style={{
								marginBottom: '.5em',
								width: '25rem'
							}}
						/>

						<TextField
							name={"password"}
							placeholder='Enter Password'
							type='password'
							InputComponent={Textbox}
							style={{
								marginBottom: '.5rem',
								width: '25rem'
							}}
						/>
					</styled.Container>
				</Form>
				)
			}}

</Formik>
)
}

export default PreBodyContent
