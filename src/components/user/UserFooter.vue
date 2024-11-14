<template>
  <CFooter class="px-4" style="background-color: lightgrey">
    <div class="container mt-4">
      <div class="row align-items-start">
        <div class="col">
          <h4>Follow Us</h4>
          <ul class="list-unstyled">
            <li><a href="#" target="_blank" class="text-decoration-none">Facebook</a></li>
            <li><a href="#" target="_blank" class="text-decoration-none">Twitter</a></li>
            <li>
              <a href="#" target="_blank" class="text-decoration-none">Instagram</a>
            </li>
          </ul>
        </div>

        <div class="col">
          <h4>Contact Us</h4>
          <form>
            <div class="mb-3">
              <label for="email" class="form-label">Email address</label>
              <input
                type="email"
                class="form-control"
                id="email"
                placeholder="Enter your email"
              />
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        </div>

        <!-- Map Section -->
        <div class="col">
          <h4>Our Location</h4>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.415484848132!2d144.9632784158972!3d-37.81420154249786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xb2f1b03e9be328a7!2sFederation%20Square!5e0!3m2!1sen!2sau!4v1644191564440!5m2!1sen!2sau"
            width="100%"
            height="200"
            style="border: 0"
            allowfullscreen="false"
            loading="lazy"
          >
          </iframe>
        </div>
      </div>
    </div>
  </CFooter>
</template>
