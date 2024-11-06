async function runApiTests() {
  console.log("Starting API Tests...\n");
  let createdTodoId;

  try {
    // Test 1: Create a new todo
    console.log("Test 1: Creating a new todo...");
    const newTodo = {
      content: "Test Todo Item",
      category: "personal",
      done: false,
    };

    const createResponse = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    });

    const createdTodo = await createResponse.json();
    createdTodoId = createdTodo.id;
    console.log("✓ Successfully created todo:", createdTodo);

    // Test 2: Get all todos
    console.log("\nTest 2: Getting all todos...");
    const getAllResponse = await fetch(API_BASE_URL);
    const allTodos = await getAllResponse.json();
    console.log("✓ Successfully retrieved todos:", allTodos);

    // Test 3: Get specific todo
    console.log(`\nTest 3: Getting todo with ID ${createdTodoId}...`);
    const getOneResponse = await fetch(`${API_BASE_URL}/${createdTodoId}`);
    const specificTodo = await getOneResponse.json();
    console.log("✓ Successfully retrieved specific todo:", specificTodo);

    // Test 4: Update todo
    console.log(`\nTest 4: Updating todo with ID ${createdTodoId}...`);
    const updateData = {
      content: "Updated Test Todo",
      category: "business",
      done: true,
    };

    const updateResponse = await fetch(`${API_BASE_URL}/${createdTodoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const updatedTodo = await updateResponse.json();
    console.log("✓ Successfully updated todo:", updatedTodo);

    // Test 5: Delete todo
    console.log(`\nTest 5: Deleting todo with ID ${createdTodoId}...`);
    const deleteResponse = await fetch(`${API_BASE_URL}/${createdTodoId}`, {
      method: "DELETE",
    });
    const deleteResult = await deleteResponse.text();
    console.log("✓ Successfully deleted todo:", deleteResult);

    console.log("\nAll tests completed successfully! ✓");
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
  }
}

// Add test button to UI when document loads
document.addEventListener("DOMContentLoaded", () => {
  const testButton = document.createElement("button");
  testButton.textContent = "Run API Tests";
  testButton.style.margin = "10px";
  testButton.addEventListener("click", runApiTests);
  document.querySelector(".app").prepend(testButton);
});
