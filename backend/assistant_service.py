from openai_client import get_openai_client

def create_developer_assistant():
    client = get_openai_client()

    assistant = client.beta.assistants.create(
        name="Developer Debugging Assistant",
        model="gpt-4.1-mini",
        instructions=(
            "You are a highly reliable developer assistant. "
            "Always respond with a useful message. "
            "NEVER leave a run incomplete. "
            "If the user says anything, you must reply with a clear explanation."
        ),
        temperature=0.4,
    )

    return assistant.id



# Create a new thread for each conversation
def create_thread():
    client = get_openai_client()
    thread = client.beta.threads.create()
    return thread.id


# Add a user message to a thread
def add_message(thread_id, content):
    client = get_openai_client()
    client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=content
    )


def run_assistant(thread_id, assistant_id):
    client = get_openai_client()

    run = client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=assistant_id,
        additional_instructions="Always respond clearly. Never skip output."
    )

    return run.id




# Check run status + get messages
def get_run_result(thread_id, run_id):
    client = get_openai_client()
    run = client.beta.threads.runs.retrieve(
        thread_id=thread_id,
        run_id=run_id
    )

    # If still running, return status only
    if run.status in ["queued", "in_progress"]:
        return {"status": run.status}

    # If completed, fetch messages
    messages = client.beta.threads.messages.list(thread_id=thread_id)

    text_messages = []
    for msg in messages.data:
        for block in msg.content:
            if block.type == "text":
                text_messages.append(block.text.value)

    return {"status": run.status, "messages": text_messages}
