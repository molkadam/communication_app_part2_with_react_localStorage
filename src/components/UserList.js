import React, { Component } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Container,
  Alert,
  Col,
  Row,
} from "react-bootstrap";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: JSON.parse(localStorage.getItem("users")) || [],
      showDeleteModal: false,
      showEditModal: false,
      currentUser: null,
      editedName: "",
      editedEmail: "",
      editedId: "",
      errors: {},
      loggedin: JSON.parse(localStorage.getItem("loggdin")) || [],
      successMessage: "",
    };
  }

  // Handle showing and hiding the Delete Modal
  handleShowDeleteModal = (user) => {
    this.setState({ showDeleteModal: true, currentUser: user });
  };

  handleCloseDeleteModal = () => {
    this.setState({ showDeleteModal: false, currentUser: null });
  };

  // Handle the actual deletion of a user
  handleDeleteUser = () => {
    const { currentUser, users } = this.state;
    const updatedUsers = users.filter((user) => user.id !== currentUser.id);
    this.setState({
      users: updatedUsers,
      showDeleteModal: false,
      currentUser: null,
    });
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    this.handleSuccess("deleted");
  };

  // Handle showing and hiding the Edit Modal
  handleShowEditModal = (user) => {
    this.setState({
      showEditModal: true,
      currentUser: user,
      editedName: user.name,
      editedEmail: user.email,
      editedId: user.id,
      errors: {},
    });
  };

  handleCloseEditModal = () => {
    this.setState({ showEditModal: false, currentUser: null, errors: {} });
  };

  // Validate the edited user
  validateEditUser = () => {
    const { editedName, editedEmail } = this.state;
    const errors = {};

    if (!editedName) {
      errors.editedName = "Name is required";
    }

    if (!editedEmail) {
      errors.editedEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(editedEmail)) {
      errors.editedEmail = "Email is invalid";
    }

    return errors;
  };

  // Handle editing the user
  handleEditUser = () => {
    const errors = this.validateEditUser();
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    const { currentUser, users, editedName, editedEmail } = this.state;
    const updatedUsers = users.map((user) =>
      user.id === currentUser.id
        ? { ...user, name: editedName, email: editedEmail }
        : user
    );
    this.setState({
      users: updatedUsers,
      showEditModal: false,
      currentUser: null,
    });
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    this.handleSuccess("updated");
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSuccess = (operation) => {
    // Set a success message based on the operation
    console.log(operation);
    this.setState({ successMessage: `User ${operation} successfully!` });
    // Hide the message after 3 seconds
    setTimeout(() => this.setState({ successMessage: "" }), 3000);
  };
  render() {
    const {
      users,
      showDeleteModal,
      showEditModal,
      editedName,
      editedEmail,
      editedId,
      errors,
      loggedin,
    } = this.state;

    return (
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <h1 className="display-4">User List</h1>
          </Col>
          {this.state.successMessage && (
            <Alert variant="success">{this.state.successMessage}</Alert>
          )}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Button
                      variant="success"
                      onClick={() => this.handleShowEditModal(user)}
                      className="me-2 rounded-0"
                    >
                      Edit
                    </Button>
                    <Button
                      disabled={loggedin.id === user.id}
                      variant="danger"
                      onClick={() => this.handleShowDeleteModal(user)}
                      className="rounded-0"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
        {/* Delete Confirmation Modal  */}
        <Modal show={showDeleteModal} onHide={this.handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseDeleteModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={this.handleDeleteUser}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit User Modal */}
        <Modal show={showEditModal} onHide={this.handleCloseEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="editedName"
                  value={editedName}
                  onChange={this.handleChange}
                  isInvalid={!!errors.editedName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.editedName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="editedEmail"
                  value={editedEmail}
                  onChange={this.handleChange}
                  isInvalid={!!errors.editedEmail}
                  disabled={loggedin.id === editedId}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.editedEmail}
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseEditModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.handleEditUser}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

export default UserList;
