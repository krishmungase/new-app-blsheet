import { TASK_TYPE_OPTIONS } from '.'

export const generateTaskPrompt = (userPrompt: string) => {
  const currentDate = new Date().toISOString().slice(0, 10)
  const messages = [
    {
      role: 'system',
      content:
        'You are an AI assistant generating structured tasks for a project management system. Your responses must be in JSON format. Ensure all fields (Title, Description, Priority, Task Type, and Due Date) are included in the JSON response.',
    },
    {
      role: 'system',
      content: `Generate a task based on the given user input. Ensure the response includes the following REQUIRED fields:
            - **Title**: A short, meaningful task title.
            - **Description**: A clear explanation of the task.
            - **Priority**: Select one from ["High", "Medium", "Low"] based on urgency.
            - **Task Type**: Choose from ${TASK_TYPE_OPTIONS.map(
              (o) => o.value
            ).join(', ')} based on relevance.
            - **Due Date**: Set within the next 5 days from the current date (${currentDate}).
  
            Follow the rules:
              1. Use taskType: ${TASK_TYPE_OPTIONS.map((o) => o.value).join(', ')}
              2. Priority: High/Medium/Low based on impact
              3. dueDate = ${currentDate} + 1-5 days (YYYY-MM-DD)
              Respond ONLY with valid JSON, including all required fields.
            
            Guidelines:
            - Assign **priority** as:
              - "High" if the task is urgent or critical for system functionality.
              - "Medium" if it’s important but not blocking.
              - "Low" if it’s an improvement or documentation update.
            - Format the response as a valid JSON object without any extra text. Ensure all required fields are present in the JSON response.
        
            Example Output:
            {
              "title": "Fix API Response Caching Issue",
              "description": "Optimize API response caching to reduce redundant requests and improve performance. Ensure cache invalidation works correctly.",
              "priority": "Medium",
              "taskType": "API",
              "dueDate": "2025-02-10"
            }`,
    },
    { role: 'user', content: userPrompt },
  ]
  return messages
}
