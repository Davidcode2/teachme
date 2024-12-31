#!/bin/bash

PDF_DIR=~/documents/Hochschule/bachelor-3/Software_Architecture/slides/
ENDPOINT=http://localhost:3000/materials

# Expand the directory path (to handle `~`)
PDF_DIR=$(eval echo "$PDF_DIR")

# Check if the directory exists
if [[ ! -d "$PDF_DIR" ]]; then
  echo "The directory $PDF_DIR does not exist."
  exit 1
fi

# Collect PDF files from the specified directory
pdf_files=("$PDF_DIR"/*.pdf)

RANDOM_PART=$(date +%s%N) # Use nanoseconds for uniqueness
EMAIL="robo+${RANDOM_PART}@teachly.store"

echo "Generated unique email: $EMAIL"

# Create a new user with the unique email
USER_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"password\"}" \
  http://localhost:3000/auth/signup)

# Extract the user ID using jq
USER_ID=$(echo "$USER_RESPONSE" | jq -r '.user.id')

for pdf_file in "${pdf_files[@]}"; do 
  echo "Processing $pdf_file"

  # Generate random values for additional fields
  title="Title $(basename "$pdf_file" .pdf)"
  description="This is a description for $(basename "$pdf_file")."
  price=$((RANDOM % 1000 + 100)) # Random price between $1.00 (100) and $10.00 (1000)
  link="http://example.com/resource/$(basename "$pdf_file" .pdf)"
  userId=$USER_ID

  echo "Uploading $pdf_file to $ENDPOINT with:"
  echo "  Title: $title"
  echo "  Description: $description"
  echo "  Price: $price"
  echo "  Link: $link"
  echo "  UserId: $userId"

  curl -X POST \
    -F "file=@$pdf_file" \
    -F "title=$title" \
    -F "description=$description" \
    -F "price=$price" \
    -F "link=$link" \
    -F "userId=$userId" \
    "$ENDPOINT"
done
